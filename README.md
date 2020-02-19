# チュートリアル： 迷路作成プログラム

## 本チュートリアルの説明

本チュートリアルは、自動で迷路を作成するプログラムを作成します。実際に手を動かしながら、class 構文についての理解を深めることを目的としています。使用する言語は**JavaScript**です。

このチュートリアルは下記のセクションに分かれています。

1. 迷路の表示：HTML と CSS で迷路を表示させます。
2. 迷路の作成：迷路の構造を表す Maze クラスを作成します。
3. 迷路の探索：迷路の探索をする Explorer クラスを作成します。

### これから作る成果物

このチュートリアルでは、迷路を自動生成します。迷路はプログラムを実行するたびに自動生成され、ただ１つの正解ルートをもちます。迷路の生成と探索にはアルゴリズムを利用しますが、事前の知識は必要ありません。

最終的な成果物はこちら：[迷路作成プログラム](http://grayhorse5.sakura.ne.jp/make-maze/)

![正解ルート表示画面](https://i.imgur.com/6uhNFuT.png)

### 前提知識

HTML, CSS, JavaScript, jQuery に多少慣れていることを想定しています。関数、オブジェクト、配列、クラスの概念について詳しい説明はしません。ただし、先に述べたように class 構文の理解がより深まるようなプログラムの構成にしています。

## 迷路の表示

まずは、迷路を表示させるために HTML と CSS ファイルを用意しましょう。今回は、Table タグを装飾することで迷路を表示させています。下記は一部抜粋して説明していますが、[こちら](https://codepen.io/matsuhaya/pen/KKpdYpm)にベースのコードを記載しています。

**index.html**

```javascript=
<table class="maze">
  <tbody>
    <tr>
      // 壁は-wall
      <td class="maze-cell -wall"></td>
      // 通路は-path
      <td class="maze-cell -path"></td>
    </tr>
  </tbody>
</table>
```

**style.css**

```css=
*,
*::before,
*::after {
  box-sizing: border-box;
}

.maze {
  border-collapse: collapse;
  margin: 20px auto 0;
}

.maze-cell {
  width: 50px;
  height: 50px;
  padding: 0;
  border: 1px solid #ddd;
}

.maze-cell.-wall {
  background-color: #000;
}

.maze-cell.-path {
  background-color: #fff;
}
```

**テーブルを装飾して表示した迷路**
![](https://i.imgur.com/jbFv4gt.png)

このように、セル（行と列の交わる箇所）の状態を壁や通路として装飾することで迷路を表で表すことができます。

## 迷路の作成

これまでは、迷路の表示を実装しました。では、これから迷路の中身を実装していきましょう。まずは、Maze クラスにコンストラクタを追加しましょう。迷路が持つ情報は全てコンストラクタの中に追加します。

**Maze.js**

```javascript=
export default class Maze {
  constructor(WIDTH, HEIGHT) {
    this.WIDTH = WIDTH; // 迷路の幅
    this.HEIGHT = HEIGHT; // 迷路の高さ
    this.grid = []; // cellTypeを格納した二次元配列
    this.startCellList = []; // 壁を生成するスタート地点となるセルの候補を格納した二次元配列
    this.start = []; // スタート地点の[row, column]
    this.goal = []; // ゴール地点の[row, column]
    this.cellType = {
      Start: 'S',
      Goal: 'G',
      Path: 0,
      Wall: 1,
      Extending: 2
    };
  }
}
```

### 迷路を二次元配列で表現する

Maze クラスでは、迷路の構造に関する情報を定義します。オセロや将棋盤のような盤面を表現するのには、二次元配列が便利です。今回は、下記のように行列で座標を表すように定義することにします。

**二次元配列の行列でセルを指定する**
![](https://i.imgur.com/Y4dDWyX.png)

### `📌ポイント： gridのタイプをリスト形式で定義する`

下記のように、grid の中に格納するセルのタイプをリスト形式で定義しておきましょう。理由は、意味のない文字や数字を論理式の中に記述するとコードの可読性が低くなるからです。少なくとも、人間が管理する範囲に関しては、人間が理解しやすいような表記を意識してコードを記述します。

```javascript=
this.cellType = {
  Start: 'S',
  Goal: 'G',
  Path: 0,
  Wall: 1,
  Extending: 2
};
```

grid を作成するサンプルコードを見てみましょう。二次元配列を作成する過程で、条件式の判定に応じて壁や道を格納しているのがわかると思います。下記のサンプルでは、初期状態なので大枠の壁以外は全て通路になるように grid を作成します。

**Maze.js**

```javascript=
// HEIGHT行,WIDTH列の行列を生成
// 大外は壁に設定
makeGrid() {
    for (let row = 0; row < this.HEIGHT; row++) {
      let rowList = [];
      for (let column = 0; column < this.WIDTH; column++) {
        if (row === 0 || row === this.HEIGHT - 1) {
          rowList.push(this.cellType.Wall);
        } else {
          if (column === 0 || column === this.WIDTH - 1) {
            rowList.push(this.cellType.Wall);
          } else {
            rowList.push(this.cellType.Path);
          }
        }
      }
      this.grid.push(rowList);
    }
  }
```

**二次元配列で表現した迷路**
![](https://i.imgur.com/XQm5ttv.png)

上記のように、二次元配列で迷路が表現できるということがわかりました。迷路作成プログラムは、まず二次元配列を作成します。その後、maze クラスで生成したインスタンスのプロパティ（ここでいうセルのタイプ）を変更していき、最終的に出来上がった maze インスタンスの情報を元に迷路を表示するという流れになります。

### 迷路を自動で作成する

さて、では実際に maze インスタンスの情報をどのように変更していけばいいのでしょうか。迷路を自動で作成するアルゴリズムはいくつかあるようなのですが、今回は「壁伸ばし法」を採用します。今回の実装手順は下記の通りです。

### `🧩アルゴリズム： 壁伸ばし法`

1. row, column がともに偶数となるセルを、壁伸ばし開始地点(候補)としてリストアップ
2. ランダムでリストからセルを選び、既存の壁かどうかを確かめる
3. **壁の拡張(\*)** を繰り返し実行する
   - 成功した場合、選んだセルはリストから削除
   - 失敗した場合、拡張中の壁に関する変更を破棄して再度壁を作り直す
4. 上記 1-3 の処理を、リストが空になるまで繰り返す

<p align="center">
<img src="https://i.imgur.com/ZQgNqs2.png" width=50%>
</p>

**(\*)壁の拡張**

1. 壁を伸ばせるかどうかを 4 方向についてチェック
   - 壁を伸ばせる方向がなければ、**壁伸ばし失敗**
   - 壁を伸ばせる方向があれば、全てリストアップ
2. ランダムでリストから壁を伸ばす方向を選び、選んだ方向に 2 マス進む
3. 行き先が壁かどうかを判定
   - 既存の壁と接続していなければ、 **壁の拡張(\*)** を再帰実行
   - 既存の壁と接続した時点で壁伸ばし終了
4. 既存の壁と接続したら、**壁伸ばし成功**

<p align="center">
<img src="https://i.imgur.com/5eKsnnt.png" width=50%>
</p>

さて、まずは壁を作成するスタート地点となるセルの候補を列挙しましょう。条件は、row, column がともに偶数となるセルです。9 マス四方の場合、スタート地点の候補は下記の通りになります。

**壁を作成するスタート地点となるセルの候補(9 マス四方の場合)**
![](https://i.imgur.com/8BVVE6E.png)

紫のセルが全て壁に置き換わった時点で、迷路の作成は完了です。実際に上記の処理を実行してみましょう。すると、下記のようなプロセスで迷路ができていきます。最初にリストアップした紫のセルが、全て黒の壁に置き換わっていることが確認できますね。なお、スタートとゴールの位置は左上と右下にそれぞれ決定しました。

**壁の拡張過程(9 マス四方の場合)**
![](https://i.imgur.com/M6UJytg.png)

### `🚨既存の壁に到達しないパターン`

実は、上記の方法でうまく壁を拡張できないパターンがあります。それは、**拡張中の壁に四方を囲まれてしまった場合**です。このパターンに陥った場合は、拡張中の壁に関する変更を破棄して再度壁を作り直します。

**既存の壁に到達しないパターン**
![](https://i.imgur.com/MI5I1Er.png)

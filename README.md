# チュートリアル： 迷路作成プログラム

<br>

## 本チュートリアルの説明

本チュートリアルは、自動で迷路を作成するプログラムを作成する過程を説明します。
使用する言語は**JavaScript**です。迷路作成プログラムでは、再帰関数やクラス構文を実装します。
これらに馴染みがない人でも、手を動かしながら作成することで学びが得られることを目的としています。

このチュートリアルは下記のセクションに分かれています。

1. 迷路の表示： JavaScript で作成した迷路情報を HTML と CSS で表示させます。
2. 迷路の自動作成： 迷路を自動作成するプログラムを実装します。
3. 迷路の自動探索： 迷路を自動作成するプログラムを実装します。

### これから作る成果物

このチュートリアルでは、迷路を自動生成します。
迷路はプログラムを実行するたびに自動生成され、ただ１つの正解ルートをもちます。
迷路の生成と探索にはアルゴリズムを利用しますが、事前の知識は必要ありません。

[**最終的な成果物を確認する**](http://grayhorse5.sakura.ne.jp/make-maze/)

<!-- ![正解ルート表示画面](https://i.imgur.com/6uhNFuT.png) -->

### 前提知識

HTML, CSS, JavaScript, jQuery を扱うのに慣れていることを想定しています。
関数、オブジェクト、配列、クラスの概念について詳しい説明はしません。
サンプルコードの記述に関しては、一部解説をしています。
このチュートリアルでは、
[アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)、
[クラス](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes)、
[import](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)、
[export](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export)を使用しています。

### チュートリアルの準備

このチュートリアルを進めるにあたって、下記のいずれかの方法で開発環境を準備します。

#### ブラウザでコードを書く

[CodePen](https://codepen.io/)を利用することで、ブラウザでコードを書くことができます。
注意事項として、外部ファイルの読み込みをするので、そのための設定が必要です。
[こちら](https://codepen.io/pwdr/pen/rdvYBe)に設定の例が記載してあります。

#### ローカル開発環境でコードを書く

好きなテキストエディタでコードを書きます。
注意事項として、外部ファイルの読み込みをするので、そのための設定が必要です。
今回は、簡易ローカルサーバを立てることができる拡張機能を導入します。
そうしなければ、CORS により外部ファイルが読み込めないためです。
例えば、テキストエディタに
[VSCode](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)を利用する場合、
[Live Sever](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)をインストールします。

<br>

## 迷路の表示

まずは、迷路を表示させるために HTML と CSS ファイルを用意しましょう。
用意するファイルは２つあります。
**_index.html_** と **_style.css_** です。
今回は、Table タグを装飾することで迷路を表現しています。

**_index.html_**

```javascript=
<!DOCTYPE html>
  <body>
    <table class="maze">
      <tbody>
        <tr>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
        </tr>
        <tr>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -start"></td>
          <td class="maze-cell -path"></td>
          <td class="maze-cell -path"></td>
          <td class="maze-cell -wall"></td>
        </tr>
        <tr>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -path"></td>
          <td class="maze-cell -wall"></td>
        </tr>
        <tr>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -path"></td>
          <td class="maze-cell -path"></td>
          <td class="maze-cell -goal"></td>
          <td class="maze-cell -wall"></td>
        </tr>
        <tr>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell -wall"></td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
```

<br>

**_style.css_**

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

.maze-cell.-start {
  background-color: #00f;
}

.maze-cell.-goal {
  background-color: #f00;
}
```

class の説明

- maze-cell: 迷路のセルを表す。通路や壁にも当てはまる共通クラス。
- -wall: 迷路の壁を表す。黒色。
- -path: 迷路の通路を表す。白色。
- -start: 迷路のスタートを表す。青色。
- -goal: 迷路のゴールを表す。赤色。

![](https://i.imgur.com/lnewAuw.png)

このように、セル（行と列の交わる箇所）を壁や通路として定義し、定義に応じた装飾をすることで迷路を表を用いて表現することができます。

### JavaScript で迷路を作成する

HTML と CSS で迷路を表示することができました。
しかし、このままでは動的に作成した迷路を表示させることができません。
これから、JavaScript で迷路の中身を実装していきましょう。
用意する JavaScript のファイルは２つあります。
**_main.js_** と **_Maze.js_** です。

**_main.js_**

```javascript=
import Maze from './Maze.js';

const WIDTH = 9;
const HEIGHT = 9;
const maze = new Maze(WIDTH, HEIGHT);
```

**_Maze.js_**

```javascript=
export default class Maze {
  constructor(WIDTH, HEIGHT) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.grid = []; // cellTypeを格納した二次元配列
    this.startCellList = []; // 壁を生成するスタート地点となるセルの候補を格納した二次元配列
    this.start = []; // スタート地点の[row, column]
    this.goal = []; // ゴール地点の[row, column]
    this.cellType = {
      Start: 'S',
      Goal: 'G',
      Path: 0,
      Wall: 1,
      Extending: 2,
      ExtendingStart: 3
    };
    this.extendingCounter = 0; // 迷路の壁を拡張するたびにカウンターが増加する
  }
}
```

２つのファイルの説明

- **_main.js_**: メインのロジックを実装。 **_Maze.js_** で定義したクラスを操作する。
- **_Maze.js_**: 迷路のクラス(Maze クラス)を定義する。

Maze クラスでは、コンストラクタを定義します。
迷路が持つ情報は、全てコンストラクタの中にプロパティとして追加します。
**_main.js_** は、 **_Maze.js_** で定義したクラスを呼び出して使えるようにしています。

```javascript=
import Maze from './Maze.js';
```

よって、Maze クラスのインスタンスを生成することが可能です。

```javascript=
const maze = new Maze(WIDTH, HEIGHT);
```

<!-- これまでは、迷路の表示を実装しました。では、これから迷路の中身を実装していきましょう。まずは、Mazeクラスにコンストラクタを追加しましょう。迷路が持つ情報は全てコンストラクタの中に追加します。

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
``` -->

### 迷路を二次元配列で表現する

Maze クラスでは、迷路の構造に関する情報を定義します。
オセロや将棋盤のような盤面を表現するのには、二次元配列が便利です。
今回は、下記のように行(Row)と列(Column)で座標を表すように定義します。

![](https://i.imgur.com/Y4dDWyX.png)

二次元配列で指定したセルの値は、cellType で用意している状態を表します。
壁にしたいセルの値は 1 で、ゴールにしたいセルの値は"G"です。

![](https://i.imgur.com/XQm5ttv.png)

### `👍gridのタイプをリスト形式で定義する`

ここでポイント 👍 を紹介します。
下記のように、grid の中に格納するセルのタイプをリスト形式で定義しておきましょう。
理由は、意味のない文字や数字を記述するとコードの可読性が低くなるからです。
少なくとも、人間が目で見て管理する範囲に関しては、人間が理解しやすいような表記を意識してコードを記述します。

```javascript=
this.cellType = {
  Start: 'S',
  Goal: 'G',
  Path: 0,
  Wall: 1,
  Extending: 2,
  ExtendingStart: 3
};
```

cellType の説明

- Extending: 拡張中の壁であることを表す。
- ExtendingStart: 壁を拡張する時の拡張開始位置候補であることを表す。

例として、リスト形式で表示しない場合のプログラムの一部を示します。

```javascript=
// 指定セルがWallではないなら、Extendingに状態を変更する
if (this.grid[row][column] !== 1) {
  this.grid[row][column] = 2;
  isExtendingSuccess = this.extendWall(row, column);
}
```

次に、リスト形式で表示した場合のプログラムの一部です。

```javascript=
// 指定セルがWallではないなら、Extendingに状態を変更する
if (this.grid[row][column] !== this.cellType.Wall) {
  this.grid[row][column] = this.cellType.Extending;
}
```

上記の２つは、内部的には同じ処理をしています。
ただ、上記のプログラムは、みたときに 1 が壁を表すことや、2 が拡張中の壁であることを表すことが頭にないと、読んだときに理解することができません。
プログラムを読むときに頭に入れておかなければいけない情報はなるべく少なくした方が、読む人にとっての負担が少ないと言えます。
もちろん、全ての場合に当てはまる書き方ではないので、場合によって使い分けましょう。

### 迷路の初期状態を作って表示する

では、早速迷路の初期状態を作成してみましょう。初期状態は、大枠の壁以外が全て通路になるように grid を作成します。
grid を作成するサンプルコードを見てみましょう。makeGrid()と initializeCellType()という２つのクラスメソッドを追加します。
このメソッドでは、grid の二次元配列を作成する過程で、条件式の判定に応じたセルに壁や道の値を代入しています。

**_Maze.js_**

```javascript=
// HEIGHT行,WIDTH列の行列を生成
  makeGrid() {
    for (let row = 0; row < this.HEIGHT; row++) {
      let rowList = [];
      for (let column = 0; column < this.WIDTH; column++) {
        rowList.push(this.initializeCellType(row, column));
      }
      this.grid.push(rowList);
    }
  }

  // rowとcolumの値に応じたcellTypeの初期化を実施
  // 大外は壁に設定
  initializeCellType(row, column) {
    if (row === 0 || row === this.HEIGHT - 1) {
      return this.cellType.Wall;
    } else {
      if (column === 0 || column === this.WIDTH - 1) {
        return this.cellType.Wall;
      } else {
        return this.cellType.Path;
      }
    }
  }
```

次に、grid の情報を元に DOM を生成するコードを用意しましょう。

**_Maze.js_**

```javascript=
// インスタンスのデータを元に、DOMを生成
drowMyself() {
  ++this.extendingCounter;
  let className = `maze step${this.extendingCounter}`;
  $('.maze-wrapper').append(
    $(`<table class="${className}"><caption>${className}</caption>`).append(
      $('<tbody>')
    )
  );

  for (let row = 0; row < this.HEIGHT; row++) {
    let tr = $('<tr>');
    for (let column = 0; column < this.WIDTH; column++) {
      if (this.grid[row][column] === this.cellType.Wall) {
        tr.append($('<td class="maze-cell -wall"></td>'));
      } else if (this.grid[row][column] === this.cellType.Extending) {
        tr.append($('<td class="maze-cell -extending"></td>'));
      } else if (this.grid[row][column] === this.cellType.ExtendingStart) {
        tr.append($('<td class="maze-cell -extending-start"></td>'));
      } else if (this.grid[row][column] === 'S') {
        tr.append($('<td class="maze-cell -start"></td>'));
      } else if (this.grid[row][column] === 'G') {
        tr.append($('<td class="maze-cell -goal"></td>'));
      } else {
        tr.append($('<td class="maze-cell -path"></td>'));
      }
    }

    $(`.maze.step${this.extendingCounter} tbody`).append(tr);
  }
}
```

**_Maze.js_** で定義したインスタンスメソッドは、 **_main.js_** で実行します。

```javascript=
maze.makeGrid();
maze.drowMyself();
```

ブラウザで確認すると、大外が壁になった迷路が描画できているはずです。

![](https://i.imgur.com/G9w5wWA.png)

コンソールに迷路インスタンスの情報を出力してみましょう。

```javascript=
console.log(maze);
```

maze.grid で参照可能な迷路構造が、描画した迷路構造と同じであることが確認できますね。

![](https://i.imgur.com/W8NAxqL.png)

これまでの手順で、二次元配列で迷路を表現できるということがわかりました。
迷路作成プログラムの流れを整理してみましょう。

- 迷路クラスで定義した、迷路インスタンスを生成
- 迷路インスタンスのプロパティとして、迷路構造を表す二次元配列を作成
- 迷路インスタンスのメソッドを実行して、プロパティを更新
- 迷路インスタンスの情報を元に迷路を表示

迷路を作成するには、迷路クラスで定義したインスタンスメソッドを実行して、迷路インスタンスの情報を更新していきます。
次は、迷路を自動で作成するメソッドを実装していきましょう。

[この時点でのコードを確認する](https://codepen.io/matsuhaya/pen/RwPGPXG)

**_Maze.js_** は[こちら](https://codepen.io/matsuhaya/pen/gOpwmQJ.js)

<br>

## 迷路の自動作成

さて、では実際に maze インスタンスの情報をどのように変更していけばいいのでしょうか。
迷路を自動で作成するアルゴリズムはいくつかあるようなのですが、今回は「壁伸ばし法」を採用します。
今回の実装手順は下記の通りです。

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

さて、まずは壁を作成するスタート地点となるセルの候補を列挙しましょう。
条件は、row, column がともに偶数となるセルです。
9 マス四方の場合、スタート地点の候補は下記の通りになります。

**壁を作成するスタート地点となるセルの候補(9 マス四方の場合)**
![](https://i.imgur.com/8BVVE6E.png)

紫のセルが全て壁に置き換わった時点で、迷路の作成は完了です。実際に上記の処理を実行してみましょう。
すると、下記のようなプロセスで迷路ができていきます。最初にリストアップした紫のセルが、全て黒の壁に置き換わっていることが確認できますね。
なお、スタートとゴールの位置は左上と右下にそれぞれ決定しました。

**壁の拡張過程(9 マス四方の場合)**
![](https://i.imgur.com/M6UJytg.png)

### `🚨既存の壁に到達しないパターン`

実は、上記の方法でうまく壁を拡張できないパターンがあります。それは、**拡張中の壁に四方を囲まれてしまった場合**です。このパターンに陥った場合は、拡張中の壁に関する変更を破棄して再度壁を作り直します。

**既存の壁に到達しないパターン**
![](https://i.imgur.com/MI5I1Er.png)

### `🕵️‍♂️テストを書いて動作を確認する`

既存の壁に到達しないパターンの動作を実装しました。
次は、上記のパターンで正しく挙動しているかを確認する必要があります。
これまでは、実装した後にブラウザで動作を確認していました。
しかし、ランダムで迷路を作成する過程で上記のパターンに陥る可能性は高くありません。
9 マス四方の場合、四隅のスタート地点から時計回りと反時計回りに壁を生成したパターンが該当するので、4×2 の合計 8 パターンしかないのです。
そこで、壁を拡張している最中に拡張中の壁に囲まれた状態を再現する必要があります。

**テストしたい範囲(左図)とテストの擬似コード(右図)**
![](https://i.imgur.com/zOSnoCU.png)

# チュートリアル：迷路作成プログラム

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

まずは、迷路を表示させるために HTML と CSS ファイルを用意しましょう。今回は、Table タグを装飾することで迷路を表示させています。

**index.html**

```javascript=
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Maze</title>
    <link rel="stylesheet" href="css/style.css" />
  </head>
  <body>
    <h1 class="title">THE 迷路</h1>
    <p class="description">
      <span class="description -blue">■</span>：スタート
      <span class="description -red">■</span>：ゴール
      <span class="description -green">■</span>：正解ルート
    </p>
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
          <td class="maze-cell"></td>
          <td class="maze-cell"></td>
          <td class="maze-cell"></td>
          <td class="maze-cell -wall"></td>
        </tr>
        <tr>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell"></td>
          <td class="maze-cell"></td>
          <td class="maze-cell"></td>
          <td class="maze-cell -wall"></td>
        </tr>
        <tr>
          <td class="maze-cell -wall"></td>
          <td class="maze-cell"></td>
          <td class="maze-cell"></td>
          <td class="maze-cell"></td>
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
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="js/main.js" type="module"></script>
  </body>
</html>
```

**style.css**

```css=
*,
*::before,
*::after {
  box-sizing: border-box;
}

.contoroller {
  text-align: center;
}

.contoroller .answer {
  font-size: 16px;
  text-decoration: none;
  color: inherit;
  display: inline-block;
  line-height: 40px;
  margin-top: 20px;
  padding: 0 20px;
  border: 1px #333 solid;
  background: rgba(0, 0, 0, 0);
  transition: all 0.3s;
}

.contoroller .answer.active {
  background: rgba(0, 255, 0, 1);
}

.title {
  text-align: center;
}

.description {
  text-align: center;
}

.description.-blue {
  color: #00f;
}

.description.-red {
  color: #f00;
}

.description.-green {
  color: #0f0;
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

.maze-cell.-answer-route.show {
  background-color: #0f0;
}

.maze-cell.-start {
  background-color: #00f;
}

.maze-cell.-goal {
  background-color: #f00;
}
```

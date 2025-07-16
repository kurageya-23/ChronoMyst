# ChronoMyst

“時を紐解き、謎を解け”  
マーダーミステリープレイヤー向け　時系列整理ツール

## デモ

https://chrono-myst.netlify.app/

## - 登場人物たちの複雑難解な行動を整理します

マーダーミステリーの登場人物はよく動き回ります。  
幸いなことに彼らは時間をはっきり覚えていることが多いため、  
時系列を整理して事件を解決に導きましょう

## - 最低限の操作で記録できます

多忙な議論中は誤字脱字が発生しがち。  
ChronoMyst では選択式のボタン等で工夫し、なるべく少ない手間で確実に記録できます。

## - 過去の事件を振り返ることができます

json ファイルへのエクスポート機能付き。  
卓の思い出としても感慨深いものとなるでしょう。

# 開発者向け資料

## コンポーネントマップ

https://miro.com/app/board/uXjVJeW6CBk=/?share_link_id=597452781343

## エンティティ

| エンティティ             | 属性                                                  |
| ------------------------ | ----------------------------------------------------- |
| 時間                     | 開始時間, 終了時間, 間隔, 複数日にわたるか            |
| 場所                     | 場所名, メモ                                          |
| 登場人物（キャラクター） | キャラ名, プレイヤー名,カラー                         |
| 出来事                   | 開始時間,終了時間,場所,証言者,関係キャラクター,カラー |

## アイデア

- 時間、場所、登場人物、プレイヤーは最初に設定（後から追加・変更可能）
- 場所、登場人物は選択式にして、出来事記入時の手間をなるべく減らす
- 出来事は関係キャラクター間で共有できるように（一つ入力したらそれぞれのタイムラインに出る）
- 登場人物や場所にはメモを可能に（主張や印象などを記入）
- マップ画像を登録し、ピン打ってメモできる
- タイムライン上をキーワード、タグ検索できる
- タイムライン上に証拠品画像をコピペ可能に
- json などでインポート/エクスポート可能に
- AI に推理させる

## Get Started

### 1. Visual Studio Code のインストール

https://code.visualstudio.com/download からお使いの OS に合わせたインストーラーを使用。

### 2. Visual Studio Code 拡張機能のインストール

VSCode のサイドメニュー＞ Extensions からインストールできます。

【必須】

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)  
  コードフォーマッターです。
- [IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)  
  コードを自動保管してくれます。
- [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=rodrigovallades.es7-react-js-snippets)  
  React 特化の自動保管です。

【任意】

- [Japanese Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ja)  
  VSCode を日本語化できます。
- [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)  
  VSCode 上のエクスプローラーやタブをわかりやすくしてくれます。

### 3. Node.js のインストール

そのまま Node.js をインストールしてもよいのですが、のちのバージョン管理を考えて Volta を使用します。  
https://volta.sh/

以下、Windows を想定した手順です。

1. コマンドプロンプトか PowerShell を開き、以下コマンドを実行します。

```
> winget install Volta.Volta
```

2. 続けて`volta -v`を実行し、バージョンが表示されたらインストール完了です。

```
> volta -v
2.0.1
```

3. Node.js をインストールするため、`volta install node`を実行します。  
   最新版の Node.js がインストールされます。

```
> volta install node
```

### 4. GitHub からソースをダウンロード

この ReadMe を読めているということはリポジトリの権限が付与されていると考えます。

ソースのダウンロード方法はいくつかありますが...

#### パターン A. ちょこっとソース見たい程度

リポジトリの「Download ZIP」から ZIP 形式でダウンロードするとよいでしょう。

#### パターン B. がっつり開発するぞ！

Git をインストールし、リポジトリをクローンしましょう。  
コマンドプロンプト or PowerShell で以下コマンドを実行します。  
（クローンするのはこのフォルダじゃなくてもどこでもよい）

```
> mkdir %UserProfile%/repos
> cd %UserProfile%/repos
> git clone https://github.com/kurageya-23/ChronoMyst.git
```

Git 未インストールの方に向け、Git のインストール方法を一応載せておきます。  
（Windows を想定）  
以下の URL からインストーラーをダウンロードして実行しましょう。  
https://git-scm.com/downloads  
なんか初期設定がやたら必要なので、このあたりを参考にポチポチします。  
https://qiita.com/takeru-hirai/items/4fbe6593d42f9a844b1c

### 5. アプリをデバッグ実行

ソースをダウンロードできたら、以下コマンドで VSCode を開きます。  
（GUI から開いても全然 OK です）

```
> cd %UserProfile%/repos/ChronoMyst
> code .
```

VSCode を開いたら、上部メニューの「Terminal > New Terminal」を開きます。  
起動したターミナル上で`npm install`を実行して依存パッケージをダウンロードします。  
（ネットワーク環境によっては結構時間かかります。特に初回インストール）

```
> npm install
```

インストールが完了したら、`npm run dev`でデバッグ実行します。  
localhost と表記された URL が出たら起動成功です。  
ブラウザでアクセスしてみましょう。

```
> npm run dev

17:29:55 [vite] (client) Re-optimizing dependencies because lockfile has changed

  VITE v6.3.5  ready in 165 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## ブランチ運用

- main
  デプロイして運用しているバージョンになります。  
  直接 push 不可（制限かけてる...はず）
- develop
  main にマージする前のシステムテストバージョンです。
- feature/[機能名(自己判断でつけて OK)]
  機能開発ブランチです。  
  develop からブランチ作成し、一通り動作確認したら develop にマージしてもらって OK です。

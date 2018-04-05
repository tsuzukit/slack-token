# Concept

Slack で reaction をつけてもらった人に ERC20 準拠の Token を付与します。

基本的には [この](https://github.com/kentaro/tiperc20) repository のコンセプトをそのまま nodejs で実装しなおした形です。

ユーザーは slack で自分の発言に reaction がつくと、前もって登録しておいた自分の Ethereum アカウントに ERC20 準拠の Token をもらえます。

Slack チーム内のコミュニケーションを促す目的での導入を想定しています。

# How it works

全体の構成は以下のような形です。

<img src="/images/slack-token-image4.png" width="900">

## ユーザーの登録

ユーザーの登録は Slack のスラッシュコマンド経由で行います。

```
/register 0x0000000000000000000000000000000000000000
```

の形で自分のアドレスを登録できます。登録されたアドレスと slack の userid は mongodb に保存されます。

## Reaction 発生時の処理

Reaction は Slack の Event API 経由で受け取ります。

Reaction が発生したら、ユーザーの slack userid から上記で登録した ethereum address を取得します。

また、reaction の種類が予め登録されたものかどうかをチェックし、token を送信するための job を作って queue に入れます。

Queue に入った job は 1 つずつ順番に取り出され、token の付与を行う Tx を作って ethereum に投げます。

マスターアカウントの nonce と Tx の nonce があっていないと処理が失敗するため、job queue を利用して処理を 1 つずつに限定しています。

<img src="/images/slack-token-image5.png" width="900">

Queue の処理では、以下の流れで処理を行い、Tx 終了前に次の処理が走るのを(出来るだけ)防ぎます。

```ecmascript 6
// Kue から呼ばれる関数
queue.process('transfer', async (job, ctx, done) => {

  let tx = null;
  // Tx を作って、ether の network に投げ込む
  await Ethereum.sendToken('0x' + job.data.to, async (hash) => {
    // Tx は直ぐに作られるので、この Callback は直ぐに呼ばれる
    // https://web3js.readthedocs.io/en/1.0/web3-eth.html#sendtransaction
    tx = hash;
    await reactionService.findByIdAndUpdateTx(job.data.reactionId, hash);
  });

  // sendToken の結果を await を使って待っているので、ここに来るときには tx の receipt は存在しているハズ
  // ただし、50 block 以内に mining が完了しない場合は Tx が失敗していなくても receipt がまだ無い場合がある
  let waitCount = 0;
  let result = null;
  // receipt を取得できるか、120 秒経過するまで待つ
  while (result == null && waitCount <= 120) {
    if (tx != null) {
      // Tx から receipt を取得する
      result = await Ethereum.getReceipt(tx);
    }
    waitCount += 1;
    sleep.sleep(1);
  }
  
  // Timeout (120 秒) せずに結果が取得できれば保存 
  if (result != null) {
    reactionService.updateStatusToComplete(job.data.reactionId,
      result.blockHash,
      result.blockNumber,
      result.cumulativeGasUsed,
      result.gasUsed);
  }
  
  // これにより、次の job が dequeue される
  done();
});

```

## ガスの支払い

ERC20 トークンを発行したマスターアカウントの秘密鍵を nodejs のサーバーに環境変数として保管し、Token 付与はそのアカウントから行います。

マスターアカウントが Token 付与のガス代を支払うため、マスターアカウントには Ethereum をディポジットしておく必要があります。

# セットアップ

## 依存関係のあるライブラリのインストール (初回のみ)

```bash
$ sh script/prepare.sh
```

## 環境ファイルを作成します

```
$ cp ./app/.env.example ./app/.env
```

内容は以下を参考に自分の環境に合わせて埋めてください

```
MONGO_DATABASE=slack-token

SALT=

ETHERESCAN_URL=https://<main 以外の場合はネットワーク名>.etherscan.io/
INFURA_ENDPOINT=https://rinkeby.infura.io/<Access Token>
SERVER_ACCOUNT_ADDRESS=<Ether account address>
SERVER_ACCOUNT_PRIVATE_KEY=<Ether account private key>
CONTRACT_ADDRESS=<Deploy 済みの ERC20 token address>

SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_VERIFICATION_TOKEN=
SLACK_TOKEN=<起動時に emoji.list を叩いてカスタム絵文字を取得するために使う>

# カンマ区切りで記載。指定しなければ全てに反応する
EMOJI=slightly_smiling_face,bug

# カンマ区切りで Slack のチャンネルIDを記載。指定しなければ全てに対応する
CHANNEL=
```

ここで指定した `SERVER_ACCOUNT_ADDRESS` アカウントの保持する ERC20 をユーザーに配布します

## 独自 ERC20 トークンの定義

`app/contract/contracts/CustomToken.sol` の変数を修正してください

```
string public name = "Token の名前";
string public symbol = "TICKER";
uint8 public decimals = 18; // Token の最小単位 
uint256 initialSupply = 10000e18; // 初期発行量 (1 = 最小単位なのでこの場合 10000 token の発行になる) 
```
### コントラクトのコンパイル

以下のコマンドでコントラクトを compile できます

```
$ sh script/contract/compile.sh
```

compile されたコントラクトは `contract/build` フォルダ以下に作られます。

### コントラクトのテスト

`ganache-cli` を利用して、実際に ethereum の network にはコントラクトを deploy せずにテストを行います

```
$ sh script/contract/test.sh
```

### コントラクトの Deploy

環境ファイルで設定した INFURA の向先によって、どのネットワークに deploy されるかが決まります

```
$ sh script/contract/deploy.sh
```

Deploy されたら、環境ファイルにコントラクトアドレスを記載してください。

## イメージのビルド

```
// ローカル環境
$ sh script/dev/build.sh

// 本番環境 では ssl を使う関係上、下記コマンドを利用
$ sh script/stg/build.sh
```

## イメージの起動

```
// ローカル環境
$ sh script/dev/start.sh

// 本番環境 では ssl を使う関係上、下記コマンドを利用
$ sh script/stg/start.sh
```

# 本番環境に Deploy

Slack App を配布するためには https 化する必要があるらしいので、([参考](https://api.slack.com/slash-commands#ssl))
[Let's encrypt](https://letsencrypt.org/) などで取得した `fullchain.pem` と `privkey.pem` を この repository の root に置いてください (Symbolic link でも問題ありません)

サーバーを起動する際には `docker-compose-ssl.yml` を使います。ssl 用の証明書は実行時に volume mount されます。

```
// 下記コマンドで ssl 設定をしてある nginx image を build します
$ sudo sh script/stg/build.sh

// 下記コマンドで証明書を上記コンテナにマウントしつつ、docker-compose でサービスを起動します
$ sudo sh script/stg/start.sh
```

# Slack との結合

## Scope

Slack token を利用するためには以下のスコープの設定が必要です。

- Slash command Scope
- Reactions Scope
- Emoji Scope

<img src="/images/slack-token-image7.png" width="500">

### Slash command

Slack の slash command は `/api/register/` に来るように設定してください

<img src="/images/slack-token-image1.png" width="500">

### Reaction Event

Event は [reaction_added](https://api.slack.com/events/reaction_added) を購読してください

Slack の管理画面メニューの `Event Sbuscriptions` を選択して、Event 送信先の Request URL を指定します。
`Add Workspace Event` ボタンから `reaction_added` を追加してください。

<img src="/images/slack-token-image2.png" width="500">

### Emoji

カスタム絵文字対応を行うために [emoji.list](https://api.slack.com/methods/emoji.list) API を起動時に呼びます。

API を呼ぶための Token を管理画面から取得して、`.env` の `SLACK_TOKEN` に指定してください。

<img src="/images/slack-token-image6.png" width="500">


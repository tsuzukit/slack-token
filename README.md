# Concept

Slack で reaction をつけてもらった人に ERC20 準拠の Token を付与します。

全体の構成は以下のような形です。

<img src="/images/slack-token-image4.png" width="600">

ERC20 トークンを発行したアカウントの秘密鍵を nodejs のサーバーに環境変数として保管し、Token 付与はそのアカウントから行います。

ユーザーは先に slash command を使って metamask や myEtherWallet などのアドレスをシステムに登録しておく必要があります。

# How it works

T.B.D

# セットアップ

## 環境ファイルを作成します

```
$ cp ./app/.env.example ./app/.env
```

内容は以下を参考に自分の環境に合わせて埋めてください

```
MONGO_DATABASE=slack-token

SALT=

INFURA_ENDPOINT=https://rinkeby.infura.io/<Access Token>
SERVER_ACCOUNT_ADDRESS=<Ether account address>
SERVER_ACCOUNT_PRIVATE_KEY=<Ether account private key>
CONTRACT_ADDRESS=<Deploy 済みの ERC20 token address>

SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_VERIFICATION_TOKEN=

# カンマ区切りで記載。指定しなければ全てに反応する
EMOJI=slightly_smiling_face,bug
```

ここで指定した `SERVER_ACCOUNT_ADDRESS` アカウントの保持する ERC20 をユーザーに配布します

## イメージのビルド

```bash
# ローカル環境
$ sh script/dev/build.sh

# 本番環境 では ssl を使う関係上、下記コマンドを利用
$ sh script/stg/build.sh
```

## イメージの起動

```bash
# ローカル環境
$ sh script/dev/start.sh

# 本番環境 では ssl を使う関係上、下記コマンドを利用
$ sh script/stg/start.sh
```

## 依存関係のあるライブラリのインストール (初回のみ)

```bash
$ sh script/prepare.sh
```

# 独自 ERC20 トークンの定義

`app/contract/contracts/CustomToken.sol` の変数を修正してください

```
string public name = "Token の名前";
string public symbol = "TICKER";
uint8 public decimals = 18; // Token の最小単位 
uint256 initialSupply = 10000e18; // 初期発行量 (1 = 最小単位なのでこの場合 10000 token の発行になる) 
```

# コントラクトのテスト

`ganache-cli` を利用して、実際に ethereum の network にはコントラクトを deploy せずにテストを行います

```bash
$ sh script/contract/test.sh
```

# コントラクトの Deploy

環境ファイルで設定した INFURA の向先によって、どのネットワークに deploy されるかが決まります

```bash
$ sh script/contract/deploy.sh
```

# 本番環境に Deploy

Slack で使うために https 化する必要がある (恐らく配布時のみ？) [slack](https://api.slack.com/slash-commands#ssl) より

[Let's encrypt](https://letsencrypt.org/) などで取得した `fullchain.pem` と `privkey.pem` を この repository の root に置いてください (Symbolic link でも問題ありません)

サーバーを起動する際には `docker-compose-ssl.yml` を使います。ssl 用の証明書は実行時に volume mount されます。

```bash
# 下記コマンドで ssl 設定をしてある nginx image を build します
$ sudo sh script/stg/build.sh

# 下記コマンドで証明書を上記コンテナにマウントしつつ、docker-compose でサービスを起動します
$ sudo sh script/stg/start.sh
```

# Slack との結合

## Slash command

Slack の slash command は `/api/register/` に来るように設定してください

<img src="/images/slack-token-image1.png" width="300">

## Event

Event は [reaction_added](https://api.slack.com/events/reaction_added) を購読してください

Slack の管理画面メニューの `Event Sbuscriptions` を選択して、Event 送信先の Request URL を指定します。
`Add Workspace Event` ボタンから `reaction_added` を追加してください。

<img src="/images/slack-token-image2.png" width="300">


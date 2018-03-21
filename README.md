# Concept

T.B.D

# How it works

T.B.D

# Setup

## Prepare env file

```
$ cp ./app/.env.example ./app/.env
```

## Build container

```
$ sh script/dev/build.sh
```

## Start container

```
$ sh script/dev/start.sh
```

## Install dependencies (first time only)

```
$ sh script/prepare.sh
```

# Test Contract

```
$ sh script/contract/test.sh
```

# Deploy contract to rinkeby

```
$ sh script/contract/deploy.sh
```

# 本番環境に Deploy

Slack で使うために https 化する必要がある (恐らく配布時のみ？) [slack](https://api.slack.com/slash-commands#ssl) より

[Let's encrypt](https://letsencrypt.org/) などで取得した `fullchain.pem` と `privkey.pem` を この repository の root に置いてください (Symbolic link でも問題ありません)

サーバーを起動する際には `docker-compose-ssl.yml` を使います。ssl 用の証明書は実行時に volume mount されます。

# API

T.B.D


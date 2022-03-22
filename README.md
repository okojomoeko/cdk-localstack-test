# cdk-localstack-test

localstack を使って cdk を練習する環境を整える

## 下準備

aws cli を docker で使うための alias 登録

```
alias awsd='docker run --rm -ti -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli --profile=localstack'
```

`ip a | grep docker`で出てきたアドレスを export する

```
export LOCALSTACK_IP=172.18.0.1
```

## 使い方

1. root で`npm install`
2. root で`docker-compose up -d`
3. infra で`npm install`
4. infra で`../node_modules/.bin/cdklocal bootstrap --profile=localstack`
5. infra で`../node_modules/.bin/cdklocal deploy --profile=localstack`

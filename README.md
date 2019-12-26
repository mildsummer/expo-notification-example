# Expo Notificationサンプル

インストール・起動は通常のExpoプロジェクトと同様です。  
最初の画面でNotificationトークンがコンソールに表示されます。  
それを使って下記のようにコマンドを実行すると通知が送られ、通知をタップしたら指定したページに遷移します。  
`http`を含むURLを入力した場合WebViewで表示されます。  

```
$ node pushNotification.js [TOKEN] [SCREEN NAME(A|B|C) or URL] [ID]
```

# インストール

```
$ npm install
or
$ yarn install
```

# ローカルで起動

```
$ npm start
or
$ yarn start
```

const request = require('request');

const [,, token, routeName, id] = process.argv;

console.log(token, routeName);

const isWebView = (/http/).test(routeName);

request({
  url: 'https://expo.io/--/api/v2/push/send',
  method: 'POST',
  json: {
    to: `ExponentPushToken[${token}]`,
    title: '通知サンプル',
    body: 'ここに説明文が入ります',
    data: isWebView ? {
      url: routeName,
      params: { id }
    } : {
      routeName,
      params: { id }
    }
  }
}, function (error, response, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(body);
  }
});

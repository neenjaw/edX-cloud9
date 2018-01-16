const request = require('request');

let url = "https://query.yahooapis.com/v1/public/yql?q=select%20wind%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22chicago%2C%20il%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

request(url, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    let parsedBody = JSON.parse(body);
    console.log(parsedBody.query.results.channel);
  } else {
    //Error
  }
});

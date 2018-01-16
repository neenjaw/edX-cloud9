// &apikey=thewdb

const express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request'),
      app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("search");
});

app.get("/results", (req, res) => {
  let search = req.query.search,
      url = `http://www.omdbapi.com/?s=${search}&apikey=thewdb`;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {

      let results = JSON.parse(body);
      console.log(results);

      // res.send(results["Search"]);
      res.render("results", {results});
    } else {
      //Error
    }
  });

});

app.listen(3000, "localhost", () => {
  console.log("Movie App is listening on port 3000, ctrl+c to exit.");
});

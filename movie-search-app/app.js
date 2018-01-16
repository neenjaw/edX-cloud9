// &apikey=thewdb

const express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request'),
      app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("GET: home");
  res.render("home");
});

// app.post("/search/:query", (req, res) => {
//   console.log("POST: search");
//   res.redirect("/results");
// });

app.get("/results", (req, res) => {
  let url = "http://www.omdbapi.com/?s=star&apikey=thewdb";

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {

      let results = JSON.parse(body);

      // res.send(results["Search"]);
      res.render("results", {results: results["Search"]});
    } else {
      //Error
    }
  });

});

app.listen(3000, "localhost", () => {
  console.log("Movie App is listening on port 3000, ctrl+c to exit.");
});

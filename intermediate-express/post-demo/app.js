const express = require('express'),
      app = express(),
      bodyParser = require('body-parser');

let friends = [
  {name:"tony"},
  {name:"ray"},
  {name:"melinda"}
];

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/friends", (req, res) => {
  res.render("friends", {friends});
});

app.post("/addfriend", (req, res) => {
  let newFriend = req.body.name;

  function makeFriend(name) {
    return {name};
  }

  friends.push(makeFriend(newFriend));

  res.redirect("/friends");
});

app.listen(3000, "localhost", () => {
  console.log("Server stared on localhost:3000");
});

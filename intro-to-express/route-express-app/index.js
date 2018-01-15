"use strict";

let express = require('express'),
    app = express();

let animalData = {
    cow: {sound: "Moo"},
    pig: {sound: "Oink"},
    dog: {sound: "Woof Woof!"}
};

// Root route
app.get("/", (req, res) => {
    res.send("Hi there, welcome to my assignment!");
});

// Pattern route
app.get("/speak/:animal", (req, res) => {
    let animal = req.params.animal;

    if (animal in animalData) {
        res.send(`The ${animal} says '${animalData[animal].sound}'`);
    } else {
        res.redirect(res.baseUrl + "/..");
    }
});

// Pattern route
app.get("/repeat/:string/:times", (req, res) => {
    let response = "";

    for (let i = 0; i < req.params.times; i++) {
        response += req.params.string + " ";
    }

    response.trim();

    res.send(response);
});

// Catch-all route
app.get("*", (req, res) => {
   res.send("Sorry, page not found... What are you doing with your life.");
});

// normal express listen
app.listen(3000, "localhost", ()=>{

// required for EdX's Cloud9
// app.listen(process.env.PORT, process.env.IP, ()=>{

    console.log("App starting");
});

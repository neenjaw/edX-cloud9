let express = require('express'),
    app = express();
    
// "/" => "Hi There!"
app.get("/", (req, res) => {
    res.send("Hi There!"); 
});

// "/bye" => "Goodbye!"
app.get("/bye", (req, res) => {
    res.send("Cya later!"); 
});

// "/dog" => "meow!"
app.get("/dog", (req, res) => {
    res.send("MEOW!"); 
});

//listen
app.listen(process.env.PORT, process.env.IP, ()=>{
    console.log('Server has started.');
});
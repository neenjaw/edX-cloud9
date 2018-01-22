const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cats');

// const Cat = mongoose.model('Cat', {
//   name: String,
//   age: Number,
//   temperament: String
// });

// OR ----------

const catSchema = mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

const Cat = mongoose.model("Cat", catSchema);

// let kitty = new Cat({ name: 'Zild', age: 2, temperament: "angry" });
// kitty.save().then(() => console.log('meow'));

//add a new cat
// let asd = new Cat({
//   name: "aSDas",
//   age: 213123,
//   temperament: "Sad"
// });
//
// asd.save((err, cat) => {
//   if (err) {
//     console.log("have a problem");
//   } else {
//     console.log("ok");
//     console.log(cat);
//   }
// });

// retrieve all cats
// Cat.find({}, function(err, cats){
//   if (err) {
//     log("Oh no");
//   } else {
//     console.log("all cats");
//     console.log(cats);
//   }
// })

//create cats
Cat.create({
  name: "Snow White",
  age: 15,
  temperament: "Bland"
}, (err, cat) => {
  if (err) {
    console.log("no");
  } else {
    console.log(cat);
  }
});

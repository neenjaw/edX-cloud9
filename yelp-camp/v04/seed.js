const mongoose = require('mongoose');
const Campground = require("./models/campground");
const Comment = require("./models/comment");

module.exports = (function() {
  'use strict';

  const campgroundData = [
    {
      "name": "Evelyn Creek",
      "image": "https://farm7.staticflickr.com/6188/6106475454_cf4dab4d64.jpg",
      "description": "A small, quiet campground by a creek, good for hikers getting a late start in the day."
    },
    {
      "name": "Little Shovel",
      "image": "https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg",
      "description": "A campground with beautiful views over Maligne Lake and the Bald Hills, situated below Little Shovel Pass. This campground is great for campers who want to avoid the busier Snowbowl campground."
    },
    {
      "name": "Snowbowl",
      "image": "https://farm4.staticflickr.com/3191/3061337059_36c9457ab6.jpg",
      "description": "Popular campground located in a spectacular meadow, sheltered by trees, with easy access to water."
    },
    {
      "name": "Curator",
      "image": "https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
      "description": "Popular with hikers taking 2 days to hike the Skyline trail. This campground is situated 0.8 km off trail and 1.2 km from spectacular Curator Lake."
    },
    {
      "name": "Tekarra",
      "image": "https://farm2.staticflickr.com/1305/566636576_6f8aee099b.jpg",
      "description": "A beautiful campground with great views, located next to a fast moving creek."
    },
    {
      "name": "Signal",
      "image": "https://farm5.staticflickr.com/4285/35301859822_4d49713574.jpg",
      "description": "A quiet campground at the top of the Signal fire road. There are great views over Jasper and surroundings from the hills above the campground."
    }
  ];

  function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Removed all campgrounds");

      Comment.remove({}, (err) => {
        if (err) {
          console.log(err);
        }

        console.log("Removed all comments");

        //add some campgrounds
        campgroundData.forEach((seed) => {
          Campground.create(seed, (err, campground) => {
            if (err) {
              console.log(err);
            } else {
              console.log("New Campground");

              //add some comments
              Comment.create({
                text: "This place is great, but I wish there was internet",
                author: "Homer"
              }, (err, comment) => {
                campground.comments.push(comment._id);
                campground.save();
                console.log("New Comment");
              })
            }
          });
        });
      });


    });


  }

  return { seedDB };

}());

// const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

module.exports = (function() {
  'use strict';

  const campgroundData = [
    {
      'name': 'Evelyn Creek',
      'image': 'https://farm7.staticflickr.com/6188/6106475454_cf4dab4d64.jpg',
      'description': 'A small, quiet campground by a creek, good for hikers getting a late start in the day.  Spicy jalapeno bacon ipsum dolor amet in eiusmod drumstick irure. Tempor ea consequat aute tail tri-tip. Ut est excepteur nostrud ribeye hamburger officia pig kevin sunt cillum ex rump consequat. Landjaeger tail consectetur brisket, alcatra minim elit incididunt cow shank dolor. Pancetta turducken officia, kevin landjaeger picanha pork excepteur veniam nostrud swine ipsum sirloin dolor tempor.'
    },
    {
      'name': 'Little Shovel',
      'image': 'https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg',
      'description': 'A campground with beautiful views over Maligne Lake and the Bald Hills, situated below Little Shovel Pass. This campground is great for campers who want to avoid the busier Snowbowl campground.  Sint in corned beef reprehenderit swine, velit incididunt meatloaf cillum. Dolore officia excepteur, filet mignon irure mollit t-bone. Culpa shankle sed proident, ribeye andouille exercitation ad chuck tongue cupidatat prosciutto ham. Bacon ut beef ribs ipsum fugiat boudin laborum ea commodo minim in porchetta buffalo chicken enim. Flank enim capicola, rump do dolore bresaola id ipsum dolor pancetta.'
    },
    {
      'name': 'Snowbowl',
      'image': 'https://farm4.staticflickr.com/3191/3061337059_36c9457ab6.jpg',
      'description': 'Popular campground located in a spectacular meadow, sheltered by trees, with easy access to water.  Tail pig pork chop elit beef meatball. Jerky pork loin ut, commodo capicola chicken andouille t-bone. Non shank culpa, lorem ex elit ham voluptate andouille id mollit. Turducken short ribs aliqua esse, burgdoggen sunt ball tip. Fugiat beef ribs minim venison reprehenderit aute t-bone tongue laboris short ribs excepteur. Tri-tip labore non dolor culpa in incididunt. Ullamco fugiat cupim lorem rump kevin, andouille eu nostrud salami duis tri-tip deserunt.'
    },
    {
      'name': 'Curator',
      'image': 'https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg',
      'description': 'Popular with hikers taking 2 days to hike the Skyline trail. This campground is situated 0.8 km off trail and 1.2 km from spectacular Curator Lake.  Shoulder sed pastrami elit chuck leberkas t-bone. Turkey tri-tip burgdoggen, in proident meatball pork chop ball tip swine officia dolore. Pariatur ipsum velit, buffalo eu pastrami nisi aute spare ribs landjaeger. Culpa duis incididunt pork esse dolor. Ut picanha cupidatat, cow pig burgdoggen prosciutto. Leberkas meatloaf ipsum ground round, nostrud do non adipisicing tenderloin.'
    },
    {
      'name': 'Tekarra',
      'image': 'https://farm2.staticflickr.com/1305/566636576_6f8aee099b.jpg',
      'description': 'A beautiful campground with great views, located next to a fast moving creek.  Ut frankfurter voluptate incididunt drumstick deserunt doner cupim tri-tip nulla laboris. Turkey alcatra esse strip steak pork loin exercitation. Labore pastrami ullamco chuck dolor. Qui doner alcatra, in burgdoggen non velit landjaeger pariatur magna frankfurter occaecat eu ex. Elit landjaeger filet mignon, pork belly alcatra cupidatat capicola sint esse.'
    },
    {
      'name': 'Signal',
      'image': 'https://farm5.staticflickr.com/4285/35301859822_4d49713574.jpg',
      'description': 'A quiet campground at the top of the Signal fire road. There are great views over Jasper and surroundings from the hills above the campground.  Ex shank magna quis adipisicing cow id in lorem nisi tail kevin. Frankfurter culpa andouille exercitation sunt pastrami. Tail dolore pork loin, nostrud ullamco shankle veniam tri-tip pork fatback consequat porchetta andouille jowl exercitation. Voluptate anim ut minim do filet mignon.'
    }
  ];

  function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('Removed all campgrounds');

      Comment.remove({}, (err) => {
        if (err) {
          console.log(err);
        }

        console.log('Removed all comments');

        //add some campgrounds
        campgroundData.forEach((seed) => {
          Campground.create(seed, (err, campground) => {
            if (err) {
              console.log(err);
            } else {
              console.log('New Campground');

              //add some comments
              Comment.create({
                text: 'This place is great, but I wish there was internet',
                author: 'Homer'
              }, (err, comment) => {
                campground.comments.push(comment._id);
                campground.save();
                console.log('New Comment');
              });
            }
          });
        });
      });


    });


  }

  return { seedDB };

}());

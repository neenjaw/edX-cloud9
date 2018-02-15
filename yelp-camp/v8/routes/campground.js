// ============================
// Node Requires
// ============================

const express = require('express');
const router  = express.Router();

// ============================
// Mongoose Model Requires
// ============================

const Campground = require('../models/campground');

// ============================
// Campground Routes
// ============================

//INDEX - show all campgrounds
router.get('/', (req, res) => {

    //get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            //Valid Campground Result
            campgrounds = campgrounds.map((campground) => {
                return {
                    name: campground.name,
                    image: campground.image,
                    id: campground._id
                };
            });

            console.log('> Showing Campground Index');

            res.render('campgrounds/index', {
                pageName: 'campgrounds/index',
                campgrounds
            });
        }
    });
});

//NEW - show form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new', {pageName: 'new'});
}); // end app.get / campgrounds/new

//CREATE - add new campground
router.post('/', isLoggedIn, (req, res) => {
    let name = req.body.name,
        image = req.body.image,
        description = req.body.description;

    if (name && image) {

        Campground.create({ name, image, description, author: req.user._id }, (err, campground) => {
            if (err) {
                //TODO: eventually replace with a redirect to the form with error
                console.log(err);
            } else {
                console.log('> New Campground created');

                res.redirect('/campgrounds');
            }
        });

    }
});

//SHOW - show a campground's detail
router.get('/:id', (req, res) => {
    let id = req.params.id;

    console.log('> Looking for campground: ' + id);

    Campground
        .findById(id)
        .populate('author')
        .populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        })
        .exec((err, campground) => {
            if (err) {
                //TODO: eventually replace with a redirect to the form with error
                console.log(err);
            } else {
                console.log('> Campsite Found:');

                //Send a sanitized copy of the data to render
                campground = {
                    id: campground._id,
                    name: campground.name,
                    image: campground.image,
                    author: {
                        id: campground.author._id,
                        name: campground.author.displayName,
                    },
                    description: campground.description,
                    created: campground.created,
                    updated: campground.updated,
                    comments: campground.comments.map((comment) => {
                        return {
                            id: comment._id,
                            text: comment.text,
                            author: {
                                id: comment.author._id,
                                name: comment.author.displayName
                            },
                            created: comment.created,
                            updated: comment.updated
                        };
                    })
                };

                console.log(campground);
                res.render('campgrounds/show', {pageName: 'campgrounds/show', campground});
            }
        });
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
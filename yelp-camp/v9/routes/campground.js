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

    const campground = req.body.campground;

    campground.author = req.user._id;

    console.log(campground);
    let result = (campground.name && campground.image && campground.description);
    console.log(result);
    

    if ( 
        typeof campground.name        === 'undefined' || 
        typeof campground.image       === 'undefined' || 
        typeof campground.description === 'undefined' 
    ) {
        res.redirect('/campgrounds/new');
    } else {
        Campground
            .create(campground, (err, newCampground) => {
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
    const id = req.params.id;

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

// EDIT
router.get('/:id/edit', (req, res) => {
    const id = req.params.id;

    Campground
        .findById(id)
        .exec((err, campground) => {
            if (err) {
                //TODO: eventually replace with a redirect to the form with error
                res.redirect('/campgrounds');
            } else {
                campground = {
                    id: campground._id,
                    name: campground.name,
                    image: campground.image,
                    description: campground.description
                };

                res.render('campgrounds/edit', {pageName: 'campgrounds/show', campground});
            }
        });
});

// UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const campground = req.body.campground;

    campground.updated = Date.now();

    campground.description = req.sanitize(campground.description);

    if (!id) {
        res.redirect('/campgrounds');
    } else {
        Campground
            .where({ _id: id})
            .update({ $set: campground }, (err, updatedCampground) => {
                if (err) {
                    console.log(err);
                    res.redirect(`/campgrounds/${id}/edit`);
                } else {
                    res.redirect(`/campgrounds/${id}`);
                }
            });
    }
});

// DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        res.redirect('/campgrounds');
    } else {
        Campground
            .where({ _id: id })
            .remove(err => {
                if (err) {
                    console.log(err);
                    res.redirect(`/campgrounds/${id}`);
                } else {
                    res.redirect('/campgrounds');
                }
            });
    }
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
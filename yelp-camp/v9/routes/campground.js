// ============================
// Node Requires
// ============================

const express    = require('express');
const router     = express.Router();
const middleware = require('../middleware');

// ============================
// Mongoose Model Requires
// ============================

const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ============================
// Campground Routes
// ============================

//INDEX - show all campgrounds
router.get('/', (req, res) => {

    //get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            res.flash('danger', `An error was encountered: ${err}`);
            res.redirect('back');
        } else {
            //Valid Campground Result
            campgrounds = campgrounds.map((campground) => {
                return {
                    name: campground.name,
                    image: campground.image,
                    id: campground._id
                };
            });

            res.render('campgrounds/index', {
                pageName: 'campgrounds/index',
                campgrounds
            });
        }
    });
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new', {pageName: 'new'});
});

//CREATE - add new campground
router.post('/', middleware.isLoggedIn, (req, res) => {

    const campground = req.body.campground;

    campground.author = req.user._id;

    if ( 
        typeof campground.name        === 'undefined' || 
        typeof campground.image       === 'undefined' || 
        typeof campground.description === 'undefined' 
    ) {
        res.flash('warning', 'Your input wasn\'t valid. Please fix.');
        res.redirect('/campgrounds/new');
    } else {
        Campground
            .create(campground, (err, newCampground) => {
                if (err) {
                    // console.log(err);
                    res.flash('danger', `An error was encountered: ${err}`);
                    res.redirect('back');
                } else {
                    res.flash('info', 'Your campsite has been created.');
                    res.redirect('/campgrounds');
                }
            });
    } 
});

//SHOW - show a campground's detail
router.get('/:id', (req, res) => {
    const id = req.params.id;

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
                console.log(err);
                res.flash('danger', `An error was encountered: ${err}`);
                res.redirect('back');
            } else {
                if (!campground) {
                    res.flash('danger', 'This campground does not exist');
                    return res.redirect('back');
                }

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

                res.render('campgrounds/show', {pageName: 'campgrounds/show', campground});
            }
        });
});

// EDIT
router.get('/:id/edit', middleware.isThisCampgroundOwner, (req, res) => {
    //send the campground to the res.render via locals
    res.locals.campground = {
        id: req.campground._id,
        name: req.campground.name,
        image: req.campground.image,
        description: req.campground.description
    };
    
    res.render('campgrounds/edit', {pageName: 'campgrounds/show'});
});

// UPDATE
router.put('/:id', middleware.isThisCampgroundOwner, (req, res) => {
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
                    // console.log(err);
                    res.flash('danger', `An error was encountered: ${err}`);
                    res.redirect(`/campgrounds/${id}/edit`);
                } else {
                    res.flash('success', 'Your campsite was updated!');
                    res.redirect(`/campgrounds/${id}`);
                }
            });
    }
});

// DELETE
router.delete('/:id', middleware.isThisCampgroundOwner, (req, res) => {
    const id = req.params.id;
    
    if (!id) {
        res.redirect('/campgrounds');
    } else {
        Campground
            .findByIdAndRemove(id, (err, campground) => {
                if (err) {
                    console.log(err);
                    res.flash('danger', `An error was encountered: ${err}`);
                    res.redirect(`/campgrounds/${id}`);
                } else {         

                    campground.comments.forEach(commentId => {

                        Comment
                            .findByIdAndRemove(commentId, (err) => {
                                if (err) {
                                    // console.log(err);
                                } else {
                                    // console.log('Comment deleted');                                
                                }
                            });             
                                       
                    });

                    res.flash('info', 'Your campsite was deleted');
                    res.redirect('/campgrounds');
                }
            });
    }
});

module.exports = router;
// ============================
// Node Requires
// ============================

const express = require('express');
const passport = require('passport');
const middleware = require('../middleware');

// ============================
// Express Router Setup
// ============================

const router = express.Router();

// ============================
// Mongoose Model Requires
// ============================

const User = require('../models/user');

// ============================
// User / Admin Routes
// ============================

//Show User Account Page
router.get('/:uid', middleware.isThisUserAuthorized, (req, res) => {
    res.locals.user = {
        id: req.user._id,
        username: req.user.username,
        name: req.user.displayName,
        created: req.user.created,
        updated: req.user.updated,
        isAdmin: req.user.isAdmin,
        password: '********'
    };

    res.render('users/show');
});

router.put('/:uid', middleware.isThisUserAuthorized, (req, res) => {
    res.send(req.body.user);

    //check what needs to be updated, validate input
    //change display name
    //use passport-local-mongoose module to change password
});

module.exports = router;
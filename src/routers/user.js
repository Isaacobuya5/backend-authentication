const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/users', async (req, res) => {
    //Create a new user
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }

        const token = await user.generateAuthToken();
        res.send({ user, token});
    } catch(error) {
        res.status(400).send(error);
        console.error(error);
    }
})

router.get('/users/me', auth, async(req, res) => {
    //view logged in user profile
    res.send(req.user);
});

router.post('/users/me/logout', auth, async (req,res) => {
    //Log user out of the application
    try {
        //filter user's tokens array and return true if any of the tokens is not equal to the token that was used by the user to login
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })//returns an array with all elements that passed the implemented test
        //the above filter array will return a new array which contains any other tokens apart from the ones the user used to login

        await req.user.save()
        res.send() //if we therefore try to get users profile we should be denied access since we are no longer logged in
    } catch (error) {
        res.status(500).send(error);
    };
});

router.post('/users/me/logoutall', auth, async(req, res) => {
    //Log user out of all devices
    try {
        //we use splice to remove tokens from the user's tokens array.
        req.user.tokens.splice(0, req.user.tokens.length);
        //we the save the user document
        await req.user.save();
    } catch(error) {
        res.status(500).send(error);
    };
});

module.exports = router;
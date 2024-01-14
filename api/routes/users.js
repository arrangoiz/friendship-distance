const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { seedUsers, addFriendship, removeFriendship, getFriendsDistance } = require('../helpers/users');


// Create a new user
router.post('/', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email
        });
        const newUser = await user.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Read all Users
router.get('/', async (req, res) => {
    try {
        let users = await User.find();
        if (users.length === 0) {
            users = await seedUsers();
        };
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }    
});

// Read single User
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('friends');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Resource not found' });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email
                }
            },
            { new: true }
        );
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Resource not found' });
    }
});

// Add new Friendship
router.put('/:id/friend', async (req, res) => {
    try {
        const updatedUser = await addFriendship(req.params.id, req.body.friendId);
        if (updatedUser instanceof Error) throw Error(updatedUser.message);
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Remove Friendship
router.delete('/:id/friend', async (req, res) => {
    try {
        const updatedUser = await removeFriendship(req.params.id, req.body.friendId);
        if (updatedUser instanceof Error) throw Error(updatedUser.message);
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) throw Error('User not found');
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Resource not found' });
    }
});

// Get relationship distance
router.get('/:id/degrees/:friendId', async (req, res) => {
    try {
        const message = await getFriendsDistance(req.params.id, req.params.friendId);
        res.json({ success: true, data: message });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

module.exports = router;
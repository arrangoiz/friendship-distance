const User = require("../models/User");

const seedUsers = async () => {
    try {
        // Lets grab some resources from randomusers.me and map them to our User model
        const res = await fetch('https://randomuser.me/api/?results=10');
        if (!res.ok) throw new Error(res.statusMessage);
        const data = await res.json();
        data.results.map(user => {
            const newUser = new User({
                name: `${user.name.first} ${user.name.last}`,
                email: user.email
            });
            newUser.save();
        });
        const users = await User.find();
        return users;
    } catch (err) {
        throw new Error('We got some error while trying to fetch users from randomusers.me');
    }
};

const addFriendship = async (user, friend) => {
    try {
        const updatedUser = await User.findById(user);
        const updatedFriend = await User.findById(friend);
        if (updatedUser.friends.includes(friend)) return (Error('Friendship already exists'));
        updatedUser.friends.push(friend);
        updatedFriend.friends.push(user);
        await updatedUser.save();
        await updatedFriend.save();
        return updatedUser;
    } catch (error) {
        return (Error('User or friend not found'));
    }
}

const removeFriendship = async (user, friend) => {
    try {
        const updatedUser = await User.findById(user);
        const updatedFriend = await User.findById(friend);
        if (!updatedUser.friends.includes(friend)) return (Error('Friendship does not exist'));
        updatedUser.friends.pull(friend);
        updatedFriend.friends.pull(user);
        await updatedUser.save();
        await updatedFriend.save();
        return updatedUser;
    } catch (error) {
        return (Error('User or friend not found'));
    }
}

const getDistance = async (user, friend) => {
    if (user._id.toString() === friend._id.toString()) return 0;
    // Let's use BFS to find the shortest path
    let queue = [user];
    let visited = new Set();
    let distance = 0;
    while (queue.length > 0) {
        let nextQueue = [];
        for (let currentUser of queue) {
            if (currentUser._id.toString() === friend._id.toString()) return distance;
            // Let's loop through current user's friends
            for (let friendId of currentUser.friends) {
                let friend = await User.findById(friendId);
                if (!visited.has(friend._id.toString())) {
                    // Let's add this friend to the next queue
                    nextQueue.push(friend);
                    visited.add(friend._id.toString());
                }
            }
        }
        queue = nextQueue;
        distance++;
    }
    return -1;
}

const getFriendsDistance = async (user, friend) => {
    try {
        var message = 'User or friend not found';
        const myUser = await User.findById(user);
        const myFriend = await User.findById(friend);
        if (myUser._id.toString() === myFriend._id.toString()) {
            message = 'User and friend are the same person';
            throw (Error(message));
        }
        // Let's compute the distance between the two users
        const distance = await getDistance(myUser, myFriend);
        switch (distance) {
            case 0:
                return `The user ${myUser.name} is direct friend from ${myFriend.name}`;
                break;
            case -1:
                return `The user ${myUser.name} has no connection to ${myFriend.name}`;
                break;
        
            default:
                return `The user ${myUser.name} is ${distance} steps distant from ${myFriend.name}`;
                break;
        }
    } catch (error) {
        throw new Error(message);
    }
}


module.exports = { 
    seedUsers,
    addFriendship,
    removeFriendship,
    getFriendsDistance
};
var express = require('express');
var database = require('../database');
var router = express.Router();

router.get(/\/.+/, function (req, res, next) {
    let playerName = req.url.substring(1);
    if (playerName.charAt(playerName.length - 1) === '/') {
        playerName = playerName.substring(0, playerName.length - 1);
    }
    let player = database.getPlayer(playerName);
    if (player) {
        res.render('user', {
            title: playerName,
            role: 'Player',
            user: player
        });
    } else {
        res.status(404).render('error', {
            message: 'Player not found',
            error: {
                status: 404,
                stack: req.url
            }
        });
    }
});

router.get('/', function (req, res, next) {
    res.render('users', {
        description: 'Players compete in science bowl games. They can be traded and drafted.',
        title: 'players',
        role: 'player',
        users: database.getPlayers()
    });
});



module.exports = router;
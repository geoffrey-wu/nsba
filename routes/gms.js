var express = require('express');
var router = express.Router();

var database = require('../database');

router.get(/\/.+/, async (req, res, next) => {
    let gmName = decodeURI(req.url.substring(1));
    if (gmName.charAt(gmName.length - 1) === '/')
        gmName = gmName.substring(0, gmName.length - 1);
    
    let gm = await database.getGM(gmName);
    if (gm) {
        res.render('user', {
            title: gmName,
            username: req.session.username,

            user: gm
        });
    } else {
        res.status(404).render('error', {
            message: 'GM not found',
            error: {
                status: 404,
                stack: req.url
            }
        });
    }
});

router.get('/', async (req, res, next) => {
    res.render('users',
        {
            description: 'A General Manager (GM) is responsible for managing a team, performing trades, and drafting a player. They do not play in games.',
            title: 'GMs',
            role: 'GM',
            users: await database.getGMs(),
            username: req.session.username
        }
    );
});

module.exports = router;

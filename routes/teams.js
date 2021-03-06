var express = require('express');
var router = express.Router();

var database = require('../database');

router.get(/\/.+/, async (req, res, next) => {
    let teamName = decodeURI(req.url.substring(1));
    if (teamName.charAt(teamName.length - 1) === '/')
        teamName = teamName.substring(0, teamName.length - 1);

    let team = await database.getTeam(teamName);

    if (team) {
        let gm = await database.getUser(team.gm);
        Promise.all(team.players.map(async (username) => {
            return await database.getUser(username);
        })).then(async (players) => {
            res.render('team', {
                title: 'My Team',
                username: req.session.username,
    
                gm: gm,
                picks: await database.getDraft(),
                players: players,
                results: await database.getResults(),
                team: team
            });
        });
    }
});

router.get('/', async (req, res, next) => {
    res.render('teams', { 
        title: 'Teams',
        username: req.session.username,

        teams: await database.getTeams(),
    });
});

module.exports = router;

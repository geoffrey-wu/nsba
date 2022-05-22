var express = require('express');
var database = require('../database');
var router = express.Router();

router.get(/\/.+/, async (req, res, next) => {
    let teamName = decodeURI(req.url.substring(1));
    if (teamName.charAt(teamName.length - 1) === '/')
        teamName = teamName.substring(0, teamName.length - 1);

    let team = await database.getTeam(teamName);

    if (team) {
        let gm = await database.getUser(team.gm);
        let players = team.player_ids.map(async (id) => {
            return await database.getUserById(id);
        });

        res.render('team', {
            title: 'My Team',
            username: req.session.username,

            gm: gm,
            picks: team.draft_picks,
            players: players,
            team: team
        });

        return;
    }
});

router.get('/', async (req, res, next) => {
    res.render('teams', { 
        title: 'Teams',
        teams: await database.getTeams(),
        username: req.session.username
    });
});

module.exports = router;

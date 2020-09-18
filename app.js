const csv = require('csv-parser');
const fs = require('fs');
const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb({
    host: '178.238.226.101',
    protocol: 'http',
    port: 5984,
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

var statsCSV = [];
var resultsCSV = [];

fs.createReadStream('stat2.csv')
    .pipe(csv())
    .on('data', (row) => {
        statsCSV.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

fs.createReadStream('results.csv')
    .pipe(csv())
    .on('data', (row) => {
        resultsCSV.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });


function Result(row) {
    return {
        home_team: row.home_team,
        away_team: row.away_team,
        home_goals: parseInt(row.home_goals),
        away_goals: parseInt(row.away_goals),
        result: parseInt(row.result)
    }
}

function Stat(row) {
    return {
        team: row.team,
        wins: parseInt(row.wins),
        losses: parseInt(row.losses),
        goals: parseInt(row.goals),
        total_yel_card: parseInt(row.total_yel_card),
        total_red_card: parseInt(row.total_red_card),
        total_scoring_att: parseInt(row.total_scoring_att),
        ontarget_scoring_att: parseInt(row.ontarget_scoring_att),
        hit_woodwork: parseInt(row.hit_woodwork),
        att_hd_goal: parseInt(row.att_hd_goal),
        att_pen_goal: parseInt(row.att_pen_goal),
        att_freekick_goal: parseInt(row.att_freekick_goal),
        att_ibox_goal: parseInt(row.att_ibox_goal),
        att_obox_goal: parseInt(row.att_obox_goal),
        total_offside: parseInt(row.total_offside),
        clean_sheet: parseInt(row.clean_sheet),
        goals_conceded: parseInt(row.goals_conceded),
        own_goals: parseInt(row.own_goals),
        total_pass: parseInt(row.total_pass),
        corner_taken: parseInt(row.corner_taken)
    }
}

for (let i = 0; i < 12; i++) {
    couch.uniqid().then(ids => {
        let id = ids[0];

        let utakmici = resultsCSV.filter(x => x.season == i).map(x=>{
            return new Result(x);
        });
        let stats = statsCSV.filter(x => x.season == i).map(x => {
            return new Stat(x)
        });
        couch.insert("fut", {
            _id: id,
            season: i,
            utakmici: utakmici,
            stats: stats
        }).then(({data, headers, status}) => {
            console.log(data, headers, status);
        }, err => {
            console.log("ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR ERROR");
        });
    });


}

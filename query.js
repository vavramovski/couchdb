const NodeCouchDb = require('node-couchdb');
var stdin = process.stdin;

const couch = new NodeCouchDb({
    host: '178.238.226.101',
    // host:'localhost',
    protocol: 'http',
    port: 5984,
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', function (key) {
    // ctrl-c ( end of text )
    if (key === '\u0003') {
        process.exit();
    }
    // write the key to stdout all normal like
    // process.stdout.write( key );
    // console.log(key)

    if (key === 'a') {
        couch.get('fut', '/_design/queryA/_view/queryA').then(({data, headers, status}) => {
            // console.log(data.rows);
            // console.log(data);

            data.rows.forEach(x => {
                console.log(x)
                // x.value.forEach(y => console.log(x.key, y))
            })
        }, err => {
            console.log(err)
        });
    }

    if (key === 'b') {
        couch.get('fut', '/_design/queryB/_view/queryB',
            {group: true}).then(({data, headers, status}) => {
            // console.log(data.rows);
            // console.log(data);
            let output = data.rows;
            output.sort(function (a, b) {
                return b.value.avg - a.value.avg;
            })
            output.forEach(x => {
                console.log(x)
            })
        }, err => {
            console.log(err)
        });
    }

    if (key === 'c') {
        couch.get('fut', '/_design/queryC/_view/queryC',
            {descending: true, limit: 3}).then(({data, headers, status}) => {
            data.rows.forEach(x => {
                console.log(x)
            })
        }, err => {
            console.log(err)
        });
    }

    if (key === 'd') {
        couch.get('fut', '/_design/queryD/_view/queryD_avg').then(({data, headers, status}) => {
            var avg = data.rows[0].value.avg;

            console.log("Average passes: " + avg);

            couch.get('fut', '/_design/queryD/_view/queryD').then(({data, headers, status}) => {
                let filteredResult = data.rows.filter(x => {
                    return x.value.passes > avg
                });
                console.log(filteredResult);
            }, err => {
                console.log(err)
            })

        }, err => {
            console.log(err)
        });
    }

    if (key === 'e') {
        couch.get('fut', '/_design/queryE/_view/queryE',
            {limit: 1, descending: true}).then(({data, headers, status}) => {

            console.log(data.rows)
        }, err => {
            console.log(err)
        });
    }

    if (key === 'f') {
        couch.get('fut', '/_design/queryF/_view/queryF',
            {group: true}).then(({data, headers, status}) => {

            data.rows.forEach(x => {
                let max = 0;
                console.log('Season: ' + x.key)

                x.value.forEach(y => {
                    y.forEach(z => {
                        max = Math.max(z.losses, max)
                    })
                })
                console.log('Maximum losses: ' + max)

                x.value.forEach(y => {
                    let filteredData = y.filter(z => {
                        return z.losses === max
                    })
                    console.log(filteredData)
                })
            })
        }, err => {
            console.log(err)
        });
    }

    if (key === 'g') {
        couch.get('fut', '/_design/queryG/_view/queryG',
            {group: true}).then(({data, headers, status}) => {

            console.log(data.rows)
        }, err => {
            console.log(err)
        });
    }

});

/** Query A*/
/*
function (doc) {
    if(doc.season==4){
        for(i=0;i<doc.stats.length;i++){
            if(doc.stats[i].own_goals>=2){
                emit(doc.stats[i].team,{
                  "team":doc.stats[i].team,
                  "own_goals":doc.stats[i].own_goals
                });
            }
        }
    }
}
}*/

/** Query B*/
/*
 // todo : SORT na app nivo
function (doc) {
  if (doc.season >= 7 && doc.season <= 11) {
    doc.stats.forEach(function(x){
      var dif = x.goals - x.goals_conceded;
      emit(x.team, dif);
    });
  }
}

function (keys, values, rereduce) {
  if (rereduce) {
   return {
     'avg': values.reduce(function(a, b) { return a + b.sum }, 0)/5
   }
  } else {
    return {
      'sum': sum(values),
    };
  }
}
}
 */


/** Query C*/
/*
couch.get('fut', '/_design/queryC/_view/queryC',
    {descending:true, limit:3}).then(({data, headers, status}) => {...}

function (doc) {
  var nereseni = 0;
  for(i=0;i<doc.stats.length;i++){
    nereseni = nereseni + (38 - doc.stats[i].wins - doc.stats[i].losses);
  }
  nereseni = nereseni/2;

  emit(doc.season, {
      "season":doc.season,
      "draw":nereseni
  });
}

function (keys, values, rereduce) {
  if(rereduce)
    return [].concat.apply([], values);

    return values;
}
*/

/** Query E*/
/*
couch.get('fut', '/_design/queryE/_view/queryE',
    {limit:1, descending:true})

function (doc) {
  if(doc.season == 5){
    for(i=0;i<doc.stats.length;i++){
      var points = (doc.stats[i].wins*3)+(38-doc.stats[i].wins-doc.stats[i].losses);
      var goal_diff = doc.stats[i].goals-doc.stats[i].goals_conceded;
        emit([points, goal_diff], {
          "season":doc.season,
          "team":doc.stats[i].team,
          "goal_difference":goal_diff,
          "points": points
        });
    }
  }
}

}*/


/** Query F*/

/*
Ne kompjalira MAP delot

 */

// function (keys, values, rereduce) {
//     if (rereduce) {
//
//         var goals_total_sum = values.reduce(function(a, b) { return a + b.goals_sum }, 0);
//         var total_scoring_att_total_sum = values.reduce(function(a, b) { return a + b.total_scoring_att_sum}, 0);
//         var ontarget_scoring_att_total_sum= values.reduce(function(a, b) { return a + b.ontarget_scoring_att_sum}, 0);
//         var total_pass_total_sum = values.reduce(function(a, b) { return a + b.total_pass_sum }, 0);
//         var length = values[0].length;
//         return {
//             'goals_sum': goals_total_sum,
//             'total_scoring_att_sum': total_scoring_att_total_sum,
//             'ontarget_scoring_att_sum': ontarget_scoring_att_total_sum,
//             'total_pass_sum': total_pass_total_sum,
//
//             'goals_avg':goals_total_sum/length,
//             'total_scoring_att_total_avg':total_scoring_att_total_sum/length,
//             'ontarget_scoring_att_total_avg':ontarget_scoring_att_total_sum/length,
//             'total_pass_total_avg':total_pass_total_sum/length,
//
//             'goals_min': values.reduce(function(a, b) { return Math.min(a, b.goals_min) }, Infinity),
//             'total_scoring_att_min': values.reduce(function(a, b) { return Math.min(a, b.total_scoring_att_min) }, Infinity),
//             'ontarget_scoring_att_min': values.reduce(function(a, b) { return Math.min(a, b.ontarget_scoring_att_min) }, Infinity),
//             'total_pass_min': values.reduce(function(a, b) { return Math.min(a, b.total_pass_min) }, Infinity),
//
//             'goals_max': values.reduce(function(a, b) { return Math.max(a, b.goals_max) }, -Infinity),
//             'total_scoring_att_max': values.reduce(function(a, b) { return Math.max(a, b.total_scoring_att_max) }, -Infinity),
//             'ontarget_scoring_att_max': values.reduce(function(a, b) { return Math.max(a, b.ontarget_scoring_att_max) }, -Infinity),
//             'total_pass_max': values.reduce(function(a, b) { return Math.max(a, b.total_pass_max) }, -Infinity),
//      }
//     } else {
//         var goals_sum = 0;
//         var total_scoring_att_sum = 0;
//         var ontarget_scoring_att_sum = 0;
//         var total_pass_sum = 0;
//
//         var goals_min = values[0].goals;
//         var total_scoring_att_min = values[0].total_scoring_att;
//         var ontarget_scoring_att_min = values[0].ontarget_scoring_att;
//         var total_pass_min = values[0].total_pass;
//
//         var goals_max = values[0].goals;
//         var total_scoring_att_max =  values[0].total_scoring_att;
//         var ontarget_scoring_att_max = values[0].ontarget_scoring_att;
//         var total_pass_max = values[0].total_pass;
//
//         values.forEach(function (x) {
//             goals_sum = goals_sum + x.goals;
//             total_scoring_att_sum = total_scoring_att_sum + x.total_scoring_att;
//             ontarget_scoring_att_sum = ontarget_scoring_att_sum + x.ontarget_scoring_att;
//             total_pass_sum = total_pass_sum + x.total_pass;
//
//             goals_min = Math.min(goals_min, x.goals);
//             total_scoring_att_min = Math.min(total_scoring_att_min, x.total_scoring_att);
//             ontarget_scoring_att_min = Math.min(ontarget_scoring_att_min, x.ontarget_scoring_att);
//             total_pass_min = Math.min(total_pass_min, x.total_pass);
//
//             goals_max = Math.max(goals_max, x.goals);
//             total_scoring_att_max = Math.min(total_scoring_att_max, x.total_scoring_att);
//             ontarget_scoring_att_max = Math.min(ontarget_scoring_att_max, x.ontarget_scoring_att);
//             total_pass_max = Math.min(total_pass_max, x.total_pass);
//         });
//
//         return {
//             'goals_sum': goals_sum,
//             'total_scoring_att_sum': total_scoring_att_sum,
//             'ontarget_scoring_att_sum': ontarget_scoring_att_sum,
//             'total_pass_sum': total_pass_sum,
//
//             'goals_min': goals_min,
//             'total_scoring_att_min': total_scoring_att_min,
//             'ontarget_scoring_att_min': ontarget_scoring_att_min,
//             'total_pass_min': total_pass_min,
//
//             'goals_max': goals_max,
//             'total_scoring_att_max': total_scoring_att_max,
//             'ontarget_scoring_att_max': ontarget_scoring_att_max,
//             'total_pass_max': total_pass_max,
//
//             'length': values.length
//         }
//     }
// }

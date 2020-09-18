const NodeCouchDb = require('node-couchdb');

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





couch.get('fut', '/_design/queryF/_view/queryF',{group:true, group_level :1}).then(({data, headers, status}) => {
    // console.log(data.row);
    // console.log(data);

    data.rows.forEach(x => {
        console.log(x)
        // x.value.forEach(y => console.log(y))
    })

}, err => {
    console.log(err)
    // either request error occured
    // ...or err.code=EDOCMISSING if document is missing
    // ...or err.code=EUNKNOWN if statusCode is unexpected
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
/** Query C*/
/*
{group:false}

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
    return [].concat.apply([], values)
    .sort(function(a,b){
      return b.draw - a.draw
    })
    .splice(0,3);

    return values;
}
*/

/** Query E*/
/*function (doc) {
    if(doc.season == 5){
        for(i=0;i<doc.stats.length;i++){
            emit(doc.stats[i].team, {
                "season":doc.season,
                "team":doc.stats[i].team,
                "goal_difference":doc.stats[i].goals-doc.stats[i].goals_conceded
                "points":(doc.stats[i].wins*3)+(38-doc.stats[i].wins-doc.stats[i].losses)*1
            });
        }
    }



  function (keys, values, rereduce) {
    return values.sort(function(a,b){
      return b.points - a.points || b.goals_conceded - a.goals_conceded
  })
  .splice(0,1)
}

}*/


var config = {
  protocol: "https",
  host: "layer3tv.atlassian.net",
  username: "justin",
  password: "MGilov$&"
};

var Helper = require('./helpers')(config);

Helper.getOpenIssues({ projects: ['PTM'], openSprints: true }, function(err, results){
  if(err){
    return console.log(err);
  }
  console.log("Listing " + (results.total || 0) + " issues:" );
  if(results.total > 0){
    Helper.printIssues(results.issues);
  }
});



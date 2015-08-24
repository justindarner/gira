var _       = require('lodash');

var color   = require('ansi-color').set;

var JiraApi = require('jira').JiraApi;
var wrap    = require('wordwrap')(5,80);
var jira;

var RED_STATUS = [5,6];

function search(query, callback){
  jira.searchJira(query, ["summary", "status", "assignee", "description"], callback);
}

function Helper(config){
  var self = this;
   jira = new JiraApi('https', config.host, 443, config.username, config.password, '2', false, true);

   this.getOpenIssues= function(params, callback){
     var jql = 'assignee = "' + config.username + '" AND resolution = unresolved';
     if(params.projects){
       jql += " AND project in (" + params.projects.join(",") + ") ";
     }
     if(params.openSprints){
       jql += " AND Sprint in (openSprints()) ";
     }
     jql += " ORDER BY key ASC ";
     search(jql, callback);
   };

   this.getIssue = function(issuekey, callback){
     var jql = 'assignee = "' + config.username + '" AND issuekey = ' + issuekey;
     search(jql, callback);
   };


   this.printIssue = function(issue, includeDescription){
     var summaryColor = "green+bold";
     if(_.contains(RED_STATUS, issue.fields.status.id)){
        summaryColor = "red+bold";
     }

     process.stdout.write(color(issue.key, summaryColor));
     process.stdout.write(" ( ");
     process.stdout.write(issue.fields.status.name);
     process.stdout.write(" ) ");
     process.stdout.write(" : ");
     process.stdout.write(issue.fields.summary);
     process.stdout.write("\n");

     if (includeDescription && issue.fields.description) {
       process.stdout.write(color("Description:\n", "white+bold"));
       process.stdout.write(wrap(issue.fields.description));
       return process.stdout.write("\n\n");
     }

   };

   this.printIssues = function(issues, includeDescription){
     _.each(issues, function(issue){
       self.printIssue(issue, includeDescription);
     });
   };
}

module.exports = function(config){
  return new Helper(config);
};

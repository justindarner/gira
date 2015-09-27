var inquirer = require('inquirer');
var _        = require('lodash');
var gitty = require('gitty');
var Repository = new gitty.Repository(process.cwd());

var questions = [
  {
    type: "input",
    name: "subject",
    message: "Git subject: ",
    validate: function(input){
      if(input.length > 0){
        return true;
      }
      return "The Git Subject must be provided";
    }
  },
  {
    type: "input",
    name: "body",
    message: "Git body: ",
  },
  {
    type: "input",
    name: "time",
    message: "Time [30m, 1h, 2h]: ",
  },

];

module.exports = function(issue, transitions){
  if(transitions){
    questions.push({
      type: "list",
      name: "transition",
      message: "Transition Issue (from " + issue.fields.status.name + " )",
      choices: _.pluck(transitions, 'name')
    });
  }
  inquirer.prompt(questions, function(answers){
    var message = issue.key + " " + answers.subject + "\n\n";
    if(answers.body){
       message +=  answers.body + "\n";
    }
    if(answers.time){
       message += "#time " + answers.time + "\n";
    }
    if(answers.transition !== issue.fields.status.name){
      message += "#" + answers.transition.toLowerCase().replace(/ /g, '-');
    }
    Repository.commit(message, function(err, results){
      if(err){
        console.log(err);
        process.exit(1);
        return;
      }
      console.log("[" + results.branch + " " + results.commit + "]");
    });
  });

};

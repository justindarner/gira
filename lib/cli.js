#!/usr/bin/env node
var path  = require('path');
var fs    = require('fs');
var yargs = require('yargs');
var gitty = require('gitty');
var Repository = new gitty.Repository(process.cwd());
var prompt     = require('./prompt');//wrapper
var interactive = require('./interactive');

var configFilePath = path.join(process.env.HOME, '.gira.json');
if(!fs.existsSync(configFilePath)){
  prompt.config(function(err, results){
    if(err){
      console.log(err);
      process.exit(1);
    }
    results.host = results.host.replace(/^http.?:\/\//i, '');
    fs.writeFileSync(configFilePath, JSON.stringify(results), 'utf8')
    console.log("saved configs to " + configFilePath);
    process.exit(0);
  });
  return;
}

var config = fs.readFileSync(configFilePath);
config = JSON.parse(config);

var projectRegex = new RegExp("(" + config.project + "-\\d+)");

var Helper = require('./helpers')(config);

var y = yargs
    .usage('Usage: $0 [options]')
    .example('$0 -l', 'list open issues')
    .example('$0 -ls', 'list open issues in current sprint')
    .example('$0 -lsd', 'include description')
    .example('$0 -g', 'Show issue for current git branch')
    .example('$0 -gd', 'include description')
    .example('$0 -c', 'git commit in an interactive mode')
    .describe('list', 'list your open issues')
    .alias('l', 'list')
    .describe('sprint', 'limit to issues in open sprint(s)')
    .alias('s', 'sprint')
    .describe('git', 'Search for issue on current branch')
    .alias('g', 'git')
    .describe('commit', 'git commit')
    .alias('c', 'commit')
    .describe('description', 'Include description in results')
    .alias('d', 'description');

var argv = y.argv;

if( !(argv.l || argv.g || argv.c) ) {
  y.showHelp();
  process.exit(1);
}



if(argv.l){
  var params = {};
  params.projects =  [config.project];
  params.openSprints = argv.s;
  Helper.getOpenIssues(params, function(err, results){
    if(err){
      return console.log(err);
    }
    console.log("Listing " + (results.total || 0) + " issues:" );
    if(results.total > 0){
      Helper.printIssues(results.issues, argv.d);
    }
  });
}

if(argv.g){
  Repository.getBranches(function(err, branches){
    if(err){
      return console.log(err);
    }
    var match = projectRegex.exec(branches.current);
    if(!match){
      return console.log("Could not find project " + config.project + " inside current branch name");
    }
    Helper.getIssue(match[1], function(err, results){
      if(err){
        return console.log(err);
      }
      if(results.total === 0){
        return console.log("Could not find issue '" + match[1] + "'");
      }
      Helper.printIssues(results.issues, argv.d);
    });
  });
}

if(argv.c){
  Repository.getBranches(function(err, branches){
    if(err){
      return console.log(err);
    }
    var match = projectRegex.exec(branches.current);
    if(!match){
      return console.log("Could not find project " + config.project + " inside current branch name");
    }
    Helper.getIssue(match[1], function(err, results){
      if(err){
        return console.log(err);
      }
      if(results.total === 0){
        return console.log("Could not find issue '" + match[1] + "'");
      }
      Helper.listTransitions(results.issues[0].id, function(err, transitions){
        interactive(results.issues[0], transitions.transitions);
      });
    });
  });
}



# gira

This is a command line application for Jira (atlassian cloud) with an small Git integration

## How do I install it?
* npm install -g gira
* You can start it with `gira`

* On first run, you will be prompted for:
  * username
  * password
  * host
  * project name
* These items are stored in ~/.gira.json

## How much is working so far?
Not much, but simply features that I use myself...

* List your current open issue
* Filter open issues to only those that are in open sprints (Jira Agile integration)
* Find the issueKey in the current git branch name; print out that issue (the reason I made this)
* Interactive commit:
  * includes Jira ticket in commit 
  * asks for git subject (headline), body
  * asks for time spent (Jira Smart Commit)
  * asks if you want to move your jira ticket state (jira Smart Commit)

## Examples ##
* `gira -l`  #List open issues 
* `gira -ls` #List open issues in open sprint
* `gira -lsd` #Include the description of the issue;
* `gira -g` #Use the jira project name to find an issueKey inside the current branch
* `gira -gd` #Include the description of the issue;
* `gira -c` #interactive commit support

## Release History
*  _0.1.4 Added Interactive commit support
*  _0.1.0 Initial Release_

## License

Copyright (c) 2015 Justin Darner
Licensed under the MIT license.

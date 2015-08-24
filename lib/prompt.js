var prompt = require('prompt');

function config(callback){
  var schema = {
      properties: {
        username: {
          pattern: /.+/,
          message: 'You most provide a username',
          required: true
        },
        password: {
          hidden: true,
          pattern: /.+/,
          message: 'You most provide a password',
          required: true
        },
        host: {
          pattern: /atlassian\.net$/,
          message: 'You most provide a host that ends with atlassian.net',
          required: true
        },
        project: {
          pattern: /.+/,
          message: 'You most provide the name of your project',
          required: true
        }
      }
  };
  prompt.start();
  prompt.get(schema, callback);
}

module.exports = {
  config: config
};

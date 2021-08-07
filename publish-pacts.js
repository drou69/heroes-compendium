let projectFolder = __dirname;
let pact = require('@pact-foundation/pact-node');
let project = require('./package.json');

let options = {
  pactFilesOrDirs: [projectFolder + '/pacts'],
  pactBroker: 'https://pascaldrouinconsultantinc.pactflow.io',
  pactBrokerToken: "z-W7aUsUK9cPhkQFeYsajg",
  consumerVersion: project.version,
  tags: ['latest']
};

pact.publishPacts(options).then(function () {
  console.log("Pacts successfully published!");
});

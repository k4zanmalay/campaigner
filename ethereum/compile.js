const path = require('path');
const fs = require('fs-extra');
const solc= require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, '../../contracts', 'campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'campaign.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};
//console.log((JSON.parse(solc.compile(JSON.stringify(input)))).contracts['inbox.sol'].Inbox);
const output = (JSON.parse(solc.compile(JSON.stringify(input)))).contracts['campaign.sol'];

fs.ensureDirSync(buildPath);
for (let contract in output){
  fs.outputJsonSync(
    path.resolve(buildPath, contract + '.json'),
    output[contract]
  );
};







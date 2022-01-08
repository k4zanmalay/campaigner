const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let factory, campaign, campaignAddress, accounts;
const factoryBytecode = compiledFactory.evm.bytecode.object;
const factoryAbi = compiledFactory.abi;
const campaignBytecode = compiledCampaign.evm.bytecode.object;
const campaignAbi = compiledCampaign.abi;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //Get a list of all accounts
  factory = await new web3.eth.Contract(factoryAbi)
  .deploy({data: factoryBytecode})
  .send({from: accounts[0], gas: '3000000'}); 
  //Use one of those accounts
  //to deploy a contract

  await factory.methods.createCampaign('100').send({from: accounts[1], gas: '3000000'});
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //assign first element in campaignAddress
  campaign = new web3.eth.Contract(campaignAbi, campaignAddress);
});

describe('Campaigns', () => {
  it('deploys contracts', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[1], manager);
  });
  it('allows to contribute ether and marks the contributor as an approver', async () => {
    await campaign.methods.contribute().send({from: accounts[2], value: '200'});
    const isApprover = await campaign.methods.approvers(accounts[2]).call();
    assert(isApprover);
  });
  it('requires a minimum amount of ether to be an approver', async () => {
    try{
      await campaign.methods.contribute().send({from: accounts[2], value: '100'});
      assert(false);
    } catch(err) {
      assert(err);
    }
  });
  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy seed', '100', accounts[3], '0')
      .send({from: accounts[1], gas: '1000000'});
    const request = await campaign.methods.requests(0).call();
    assert.equal('Buy seed', request.description);
  });
  it('allows to contribute ether to requests and sends it to recipients', async () => {
    const recipientBalanceBefore = await web3.eth.getBalance(accounts[3]);
    await campaign.methods
      .createRequest('Buy seed', '2000000', accounts[3], '0')
      .send({from: accounts[1], gas: '1000000'});
    await campaign.methods.contribute().send({from: accounts[2], value: '2000000'});
    await campaign.methods.approveRequest('0').send({from: accounts[2], gas: '1000000'});
    await campaign.methods.finalizeRequest('0').send({from: accounts[1], gas: '1000000' });
    const recipientBalanceAfter = await web3.eth.getBalance(accounts[3]);  
    const difference = recipientBalanceAfter - recipientBalanceBefore;
    assert(difference > '1900000');
  });
});


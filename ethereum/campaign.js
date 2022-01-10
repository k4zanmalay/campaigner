import {web3} from './web3';
import  compiledCampaign from './build/Campaign.json';

const campaignAbi = compiledCampaign.abi;

export default (address) => {
  return new web3.eth.Contract(campaignAbi, address);
};


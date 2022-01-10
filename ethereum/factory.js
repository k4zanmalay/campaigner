import {web3} from './web3';
import  compiledFactory from './build/CampaignFactory.json';

const factoryAbi = compiledFactory.abi;
const factoryAddress = '0xF4F54CA3dBc53525681CeDdeCbf7279C6C2A987C';
const factory = new web3.eth.Contract(factoryAbi, factoryAddress);

export default factory;

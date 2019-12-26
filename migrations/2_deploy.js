const TestToken = artifacts.require('helper/TestToken');
const WwanToken = artifacts.require('helper/WwanToken');
const Proxy = artifacts.require('Proxy');
const Hydro = artifacts.require('HybridExchange');

module.exports = async (deployer, network, accounts) => {
 // wwan
 await deployer.deploy(WwanToken);
 const wwan = await WwanToken.deployed();
 console.log("wwan: " + wwan.address);

 // hot
 await deployer.deploy(TestToken, "MoLin coins in wanchain", "WML", 18);
 const hot = await TestToken.deployed();
 console.log("hot: " + hot.address);

 // proxy
 await deployer.deploy(Proxy);
 const proxy = await Proxy.deployed();
 console.log("proxy: " + proxy.address);

 // exchange
 await deployer.deploy(Hydro, proxy.address, hot.address);
};


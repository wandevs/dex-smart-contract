const Web3 = require('web3');
const Proxy = artifacts.require('./Proxy.sol');
const HybridExchange = artifacts.require('./HybridExchange.sol');
const TestToken = artifacts.require('./helper/TestToken.sol');
const WethToken = artifacts.require('WethToken');
const WwanToken = artifacts.require('WwanToken');
const BigNumber = require('bignumber.js');

BigNumber.config({ EXPONENTIAL_AT: 1000 });

module.exports = async (deployer, network, accounts) => {
    // deploy wethToken wwanToken
    // await deployer.deploy(WethToken);
    // await deployer.deploy(WwanToken);
    //
    // // deploy proxy testToken
    // await deployer.deploy(Proxy);
	// await deployer.deploy(TestToken, "Hot coins in wan chain", "HTC", 18);
    //
	// // show
	// const proxy = await Proxy.deployed();
	// const hot = await TestToken.deployed();
    //
	// // deploy deploy hybrid exchange
	// await deployer.deploy(HybridExchange, proxy.address, hot.address);
    // const exchange = await HybridExchange.deployed();
    // console.log("exchange address = " + exchange.address);
    //
    // console.log("proxy address " + proxy.address);
    // for (let p in proxy) {
    //     console.log(p, ":", Proxy[p]);
    // }
    // await proxy.addAddress(exchange.address);

    // 'WethToken':0x7Ec1331b1bd4BD60E4d8D5140a3b06C9A2452775
    // 'WwanToken':0xDC74016C6a7ACF10EB1332Cf58b1F77A606806D9
    // 'Proxy':0x134BBA4d05117bebC54341a2e03E789ca557859e
    // 'TestToken':0x09F18A980cC6C62BcC3fAd423a93049eBe91a055
    // 'HybridExchange':0xF679d9379f8eAf81D1cDA68AC08500A2929Be2E7
    // await proxy.addAddress("0xF679d9379f8eAf81D1cDA68AC08500A2929Be2E7".toLocaleLowerCase());


    // for wanchain test net
    console.log("accounts[0] = " + accounts[0]);
    const hotTokenAddress = "0x90fb6abca9aa83044abcdaa6f0bf2fb3d63fa45a";
    const proxyAddress = "0x9e57b9f1d836ff1701e441a619cbaad7fc8863d3";
    await deployer.deploy(HybridExchange, proxyAddress, hotTokenAddress);
    const exchange = await HybridExchange.deployed();
    const exchangeAddress = exchange.address;
    console.log("exchange address = " + exchangeAddress);
    // await Proxy.addAddress(exchangeAddress);
    // console.log("proxy add address " + exchangeAddress);

};

const TestToken = artifacts.require('helper/TestToken');
const WwanToken = artifacts.require('helper/WwanToken');
const Proxy = artifacts.require('Proxy');
const Hydro = artifacts.require('HybridExchange');

module.exports = async (deployer, network, accounts) => {
    // // wwan
    // await deployer.deploy(WwanToken);
    // const wwan = await WwanToken.deployed();
    // console.log("wwan: " + wwan.address);
    //
    // // hot
    // await deployer.deploy(TestToken, "MoLin coins in wanchain", "WML", 18);
    // const hot = await TestToken.deployed();
    // console.log("hot: " + hot.address);
    //
    // // proxy
    // await deployer.deploy(Proxy);
    // const proxy = await Proxy.deployed();
    // console.log("proxy: " + proxy.address);
    //
    // // exchange
    // await deployer.deploy(Hydro, proxy.address, hot.address);

    await deployer.deploy(Hydro, "0x9e57b9f1d836ff1701e441a619cbaad7fc8863d3", "0x90fb6abca9aa83044abcdaa6f0bf2fb3d63fa45a");
    const hydro = await Hydro.deployed();
    // const Proxy2 = web3.eth.contract([{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"adr","type":"address"}],"name":"addAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"adr","type":"address"}],"name":"removeAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"depositEther","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whitelist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"adr","type":"address"}],"name":"AddressAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"adr","type":"address"}],"name":"AddressRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]);
    // const proxy = Proxy2.at("0x9e57b9f1d836ff1701e441a619cbaad7fc8863d3");
    // await proxy.addAddress(hydro.address, {from:"0xbf12c73CCC1F7F670Bf80d0BBa93Fe5765df9FEc",gas:'0x47DE70', gasPrice:'0x29E8D60800'});
};

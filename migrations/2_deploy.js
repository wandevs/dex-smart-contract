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

    // let hotAddress;
    //
    // const deployHydroMainContract = async hotAddress => {
    //     await deployer.deploy(BatchActions);
    //     await deployer.deploy(Auctions);
    //     await deployer.deploy(OperationsComponent);
    //
    //     await deployer.link(BatchActions, Hydro);
    //     await deployer.link(OperationsComponent, Hydro);
    //     await deployer.link(Auctions, Hydro);
    //
    //     await deployer.deploy(Hydro, hotAddress);
    // };
    //
    // if (network == 'production') {
    //     hotAddress = '0x9af839687f6c94542ac5ece2e317daae355493a1';
    //     await deployHydroMainContract(hotAddress);
    //     await deployer.deploy(StableCoinInterestModel);
    //     await deployer.deploy(CommonInterestModel);
    // } else if (network == 'kovan') {
    //     hotAddress = '0x16c4f3DcFcC23fAA9fc8e3E849BDf966953beE91';
    //     await deployHydroMainContract(hotAddress);
    //     await deployer.deploy(StableCoinInterestModel);
    //     await deployer.deploy(CommonInterestModel);
    //     // use Price Oracle for test
    //     await deployer.deploy(PriceOracle);
    // } else if (network == 'ropsten') {
    //     hotAddress = '0x9568e9Eaf8076230A39f173A85FA38CC9776BC25';
    //     await deployer.deploy(TestToken, 'Test Ethereum', 'tETH', 18);
    //     await deployHydroMainContract(hotAddress);
    //     await deployer.deploy(StableCoinInterestModel);
    //     await deployer.deploy(CommonInterestModel);
    // } else {
    //     // for development & test
    //     await deployer.deploy(HydroToken);
    //     hot = await HydroToken.deployed();
    //     await deployHydroMainContract(hot.address);
    //     await deployer.deploy(DefaultInterestModel);
    //     await deployer.deploy(PriceOracle);
    // }
};

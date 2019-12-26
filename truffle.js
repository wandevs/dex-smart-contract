const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
            gas: 0xfffffffffff,
            gasPrice: 1
        },
        production: {
            provider: () => new HDWalletProvider(process.env.PK, 'https://mainnet.infura.io'),
            network_id: 1,
            gasPrice: 10000000000,
            gas: 4000000
        },
        ropsten: {
            provider: () =>
                new HDWalletProvider(
                    process.env.PK,
                    'https://ropsten.infura.io/v3/d4470e7b7221494caaaa66d3a353c5dc'
                ),
            network_id: 3,
            gas: 8000000,
            gasPrice: 10000000000
        },
        rinkeby: {
            provider: () =>
                new HDWalletProvider(
                    process.env.PK,
                    'https://rinkeby.infura.io/v3/d4470e7b7221494caaaa66d3a353c5dc'
                ),
            network_id: 4,
            gas: 7000000,
            gasPrice: 10000000000
        },
        kovan: {
            provider: () =>
                new HDWalletProvider(
                    process.env.PK,
                    'https://kovan.infura.io/v3/d4470e7b7221494caaaa66d3a353c5dc'
                ),
            network_id: 42,
            gas: 8000000,
            gasPrice: 10000000000
        },
        coverage: {
            host: '127.0.0.1',
            port: 6545,
            network_id: '*',
            gas: 0xfffffffffff,
            gasPrice: 1
        },
        test3: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*", // Match any network id
            gas: 10000000,
            gasPrice: 180e9,
            from: "0x06f6B911A07E73E90FD9Dcb56C970cdBaA7E4e52",
        },
        wanchainTestnet: {
            host: "192.168.1.19",
            port: 3333,
            network_id: "*", // Match any network id
            gas: 0x989680,
            gasPrice: 180000000000,
            from: "0xbf12c73ccc1f7f670bf80d0bba93fe5765df9fec",
        }
    },
    compilers: {
        solc: {
            version: '0.5.8',
            evmVersion: "byzantium",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }

        // If you have 0.5.13 solc installed locally, you can use the following config to speed up tests.
        //
        //  solc: {
        //     version: 'native'
        //  }
    },
    mocha: {
        enableTimeouts: false,
        useColors: true
    }
};

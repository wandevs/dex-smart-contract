var PrivateKeyProvider = require('truffle-privatekey-provider');

// key store
// const KeystoreProvider = require("truffle-keystore-provider");
//
// const memoizeKeystoreProviderCreator = () => {
//     let providers = {};
//
//     return (account, dataDir, providerUrl) => {
//         if (providerUrl in providers) {
//             return providers[providerUrl]
//         } else {
//             const provider = new KeystoreProvider(account, dataDir, providerUrl);
//             providers[providerUrl] = provider;
//             return provider
//         }
//     }
// };
//
// const createKeystoreProvider = memoizeKeystoreProviderCreator()

// export
module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
            gas: 4000000,
            gasPrice: 1
        },
        production: {
            provider: () => new PrivateKeyProvider(process.env.PK, 'https://mainnet.infura.io'),
            network_id: 1,
            gasPrice: 10000000000,
            gas: 4000000
        },
        ropsten: {
            provider: () => new PrivateKeyProvider(process.env.PK, 'https://ropsten.infura.io'),
            network_id: 3,
            gasPrice: 10000000000
        },
        coverage: {
            host: 'localhost',
            network_id: '*',
            port: 6545,
            gas: 0xfffffffffff,
            gasPrice: 0x01
        },
        test3: {
            from: "0xbf12c73ccc1f7f670bf80d0bba93fe5765df9fec",
            host: "192.168.1.19",
            port: 3333,
            network_id: "*",
            gas: 4710000,
            gasPrice: 180000000000
        },
        // test4: {
        //     // provider: createKeystoreProvider(process.env.ACCOUNT, process.env.DATA_DIR, "https://rinkeby.infura.io"),
        //     provider: createKeystoreProvider("bf12c73ccc1f7f670bf80d0bba93fe5765df9fec", "/home/jsw/go/src/github.com/wanchain/dex-smart-contract", "https://mywanwallet.io/testnet"),
        //     network_id: "*",
        //     gas: 4710000,
        //     gasPrice: 180000000000
        // }
    },
    compilers: {
        solc: {
            version: '0.4.24',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    },
    mocha: {
        enableTimeouts: false
    }
};

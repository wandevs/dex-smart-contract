var PrivateKeyProvider = require('truffle-privatekey-provider');

////// add for keystore
// const KeystoreProvider = require("truffle-keystore-provider");
//
// const memoizeKeystoreProviderCreator = () => {
//     let providers = {}
//
//     return (account, dataDir, providerUrl) => {
//         if (providerUrl in providers) {
//             return providers[providerUrl]
//         } else {
//             const provider = new KeystoreProvider(account, dataDir, providerUrl)
//             providers[providerUrl] = provider
//             return provider
//         }
//     }
// }
//
// const createKeystoreProvider = memoizeKeystoreProviderCreator();
// bf12c73CCC1F7F670Bf80d0BBa93Fe5765df9FEc 92e1dbf97d49a81e23d8f29bdd265cb681a6a75420a66ae4e6f47afcb3af4329
/////// add end

module.exports = {
    networks: {
        development: {
            // host: '127.0.0.1',
            // port: 8545,
            provider: () => new PrivateKeyProvider("5410edf28844fb8ffcb6f7e5d6be2ff46673ac6e4188a50cadf1addaba25dd2a", 'http://127.0.0.1:8545'),
            // provider: createKeystoreProvider("0xbf12c73ccc1f7f670bf80d0bba93fe5765df9fec", "/home/jsw/go/src/github.com/wanchain/dex-smart-contract", "http://127.0.0.1:8545"),
            network_id: '*',
            gas: 10000000,
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
            // host: "http://testdex.wandevs.org",
            host: "172.31.11.61",
            port: 38545,
            network_id: "*",
            gas: 4710000,
            gasPrice: 180000000000
        },
        test4: {
            // provider: createKeystoreProvider(process.env.ACCOUNT, process.env.DATA_DIR, "https://rinkeby.infura.io"),
            // provider: createKeystoreProvider("0xbf12c73ccc1f7f670bf80d0bba93fe5765df9fec", "/home/jsw/go/src/github.com/wanchain/dex-smart-contract", "https://mywanwallet.io/testnet"),
            provider: () => new PrivateKeyProvider("92e1dbf97d49a81e23d8f29bdd265cb681a6a75420a66ae4e6f47afcb3af4329", 'https://mywanwallet.io/testnet'),
            network_id: "*",
            gas: 4710000,
            gasPrice: 180000000000
        },
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

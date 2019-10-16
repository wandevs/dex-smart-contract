var keythereum = require("keythereum");

// optional private key and initialization vector sizes in bytes
// (if params is not passed to create, keythereum.constants is used by default)
var params = { keyBytes: 32, ivBytes: 16 };

// synchronous
// var dk = keythereum.create(params);
// dk:
// {
//     privateKey: <Buffer ...>,
//     iv: <Buffer ...>,
//     salt: <Buffer ...>
// }
function createKeyObject(dk, password) {
    // var kdf = "scrypt"; // "pdkdf2".If unspecified, PBKDF2-SHA256 will be used to derive the AES secret key
    var options = {
        kdf: "pbkdf2",
        cipher: "aes-128-ctr",
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
        }
    };
    return keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options); // can be async
}

// var dk = keythereum.create(params); // can be async
// var keyObject1 = createKeyObject(dk, "iloveethereum");
// keythereum.exportToFile(keyObject1);

/// key import
var datadir = "./";
// Synchronous
var keyObject = keythereum.importFromFile("bf12c73CCC1F7F670Bf80d0BBa93Fe5765df9FEc", datadir);
var privateKey = keythereum.recover("wanglu", keyObject);
console.log(privateKey.toString('hex'));

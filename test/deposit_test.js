const assert = require('assert');
const TestToken = artifacts.require('./helper/TestToken.sol');
const { newContract, getContracts, getWeb3 } = require('./utils');
const BigNumber = require('bignumber.js');

contract('DepositProxy', accounts => {
    let depositProxy;

    before(async () => {
        const contracts = await getContracts();
        depositProxy = contracts.depositProxy;

        // add creator into whitelist
        await depositProxy.methods.addAddress(accounts[1]).send({ from: accounts[0] });
    });

    it('deposit and withdraw ether', async () => {
        let balanceInContract;
        const ether_address = '0x0000000000000000000000000000000000000000';

        const newWeb3 = getWeb3();
        balanceInContract = await depositProxy.methods.balanceOf(ether_address, accounts[2]).call();
        assert.equal(balanceInContract, '0');

        const balance = new BigNumber(2).times(10 ** 18).toString();

        // deposit ether
        await newWeb3.eth.sendTransaction({
            from: accounts[2],
            to: depositProxy._address,
            value: balance
        });
        balanceInContract = await depositProxy.methods.balanceOf(ether_address, accounts[2]).call();
        assert.equal(balanceInContract, balance);

        // withdraw ether
        await depositProxy.methods.withdraw(ether_address, balance).send({ from: accounts[2] });
        balanceInContract = await depositProxy.methods.balanceOf(ether_address, accounts[2]).call();
        assert.equal(balanceInContract, '0');
    });

    it('deposit and withdraw token', async () => {
        let balanceInContract;
        const testToken = await newContract(TestToken, 'TestToken', 'TT', 18, {
            from: accounts[1]
        });

        // give accounts 2 some tokens
        await testToken.methods.transfer(accounts[2], '30000').send({ from: accounts[1] });
        assert.equal('30000', await testToken.methods.balanceOf(accounts[2]).call());

        // accounts 2 approve
        await testToken.methods.approve(depositProxy._address, '10000').send({ from: accounts[2] });
        assert.equal(
            '10000',
            await testToken.methods.allowance(accounts[2], depositProxy._address).call()
        );

        // deposit tokens
        await depositProxy.methods
            .depositToken(testToken._address, '10000')
            .send({ from: accounts[2] });
        balanceInContract = await depositProxy.methods
            .balanceOf(testToken._address, accounts[2])
            .call();
        assert.equal(balanceInContract, '10000');

        // withdraw tokens
        await depositProxy.methods
            .withdraw(testToken._address, '10000')
            .send({ from: accounts[2] });
        balanceInContract = await depositProxy.methods
            .balanceOf(testToken._address, accounts[2])
            .call();
        assert.equal(balanceInContract, '0');
    });

    it('should transfer 10000 tokens from a to b - depositProxy', async () => {
        let balanceInContract;
        const testToken = await newContract(TestToken, 'TestToken', 'TT', 18, {
            from: accounts[1]
        });

        // give accounts 2 some tokens
        await testToken.methods.transfer(accounts[2], '30000').send({ from: accounts[1] });
        assert.equal('30000', await testToken.methods.balanceOf(accounts[2]).call());

        // accounts 2 approve
        await testToken.methods.approve(depositProxy._address, '10000').send({ from: accounts[2] });

        // deposit tokens
        await depositProxy.methods
            .depositToken(testToken._address, '10000')
            .send({ from: accounts[2] });

        // transfer 10000 tokens from a to b in depositProxy
        await depositProxy.methods
            .transferFrom(testToken._address, accounts[2], accounts[3], '10000')
            .send({ from: accounts[1] });

        balanceInContract = await depositProxy.methods
            .balanceOf(testToken._address, accounts[3])
            .call();
        assert.equal(balanceInContract, '10000');

        balanceInContract = await depositProxy.methods
            .balanceOf(testToken._address, accounts[2])
            .call();
        assert.equal(balanceInContract, '0');
    });
});

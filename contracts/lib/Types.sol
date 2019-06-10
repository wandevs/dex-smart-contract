/*

    Copyright 2019 The Hydro Protocol Foundation

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./EIP712.sol";
import "./Math.sol";
import "./Consts.sol";
import "./Store.sol";
import "./Signature.sol";

library Types {
    enum LoanSource {
        Pool,
        P2P
    }

    enum CollateralAccountStatus {
        Normal,
        Liquid
    }

    enum OrderStatus {
        EXPIRED,
        CANCELLED,
        FILLABLE,
        FULLY_FILLED
    }

    /**
     * Signature struct contains typical signature data as v, r, and s with the signature
     * method encoded in as well.
     */
    struct Signature {
        /**
         * Config contains the following values packed into 32 bytes
         * ╔════════════════════╤═══════════════════════════════════════════════════════════╗
         * ║                    │ length(bytes)   desc                                      ║
         * ╟────────────────────┼───────────────────────────────────────────────────────────╢
         * ║ v                  │ 1               the v parameter of a signature            ║
         * ║ signatureMethod    │ 1               SignatureMethod enum value                ║
         * ╚════════════════════╧═══════════════════════════════════════════════════════════╝
         */
        bytes32 config;
        bytes32 r;
        bytes32 s;
    }

    struct Wallet {
        mapping(address => uint256) balances;
    }

    enum WalletCategory {
        Balance,
        CollateralAccount
    }

    struct WalletPath {
        WalletCategory category;
        uint16 marketID;
        address user;
    }

    struct Market {
        // If the collateralRate is below this rate, the account will be liquidated
        uint16 liquidateRate;

        // If the collateralRate is above this rate, the account asset balance can be withdrawed
        uint16 withdrawRate;

        address baseAsset;
        address quoteAsset;
    }

    struct CollateralAccount {
        uint32 id;
        uint16 marketID;
        CollateralAccountStatus status;
        address owner;

        Wallet wallet;
    }

    // memory only
    struct CollateralAccountDetails {
        bool       liquidable;
        uint256    debtsTotalUSDValue;
        uint256    balancesTotalUSDValue;
    }

    struct Auction {
        uint32 id;

        // To calculate the ratio
        uint32 startBlockNumber;

        uint16 marketID;

        address borrower;
        address debtAsset;

        address collateralAsset;
    }

    struct Order {
        address trader;
        address relayer;
        address baseToken;
        address quoteToken;
        uint256 baseTokenAmount;
        uint256 quoteTokenAmount;
        uint256 gasTokenAmount;

        /**
         * Data contains the following values packed into 32 bytes
         * ╔════════════════════╤═══════════════════════════════════════════════════════════╗
         * ║                    │ length(bytes)   desc                                      ║
         * ╟────────────────────┼───────────────────────────────────────────────────────────╢
         * ║ version            │ 1               order version                             ║
         * ║ side               │ 1               0: buy, 1: sell                           ║
         * ║ isMarketOrder      │ 1               0: limitOrder, 1: marketOrder             ║
         * ║ expiredAt          │ 5               order expiration time in seconds          ║
         * ║ asMakerFeeRate     │ 2               maker fee rate (base 100,000)             ║
         * ║ asTakerFeeRate     │ 2               taker fee rate (base 100,000)             ║
         * ║ makerRebateRate    │ 2               rebate rate for maker (base 100)          ║
         * ║ salt               │ 8               salt                                      ║
         * ║ isMakerOnly        │ 1               is maker only                             ║
         * ║ walletType         │ 1               0: balance, 1: market                     ║
         * ║ marketID           │ 2               marketID                                  ║
         * ║                    │ 6               reserved                                  ║
         * ╚════════════════════╧═══════════════════════════════════════════════════════════╝
         */
        bytes32 data;
    }

        /**
     * When orders are being matched, they will always contain the exact same base token,
     * quote token, and relayer. Since excessive call data is very expensive, we choose
     * to create a stripped down OrderParam struct containing only data that may vary between
     * Order objects, and separate out the common elements into a set of addresses that will
     * be shared among all of the OrderParam items. This is meant to eliminate redundancy in
     * the call data, reducing it's size, and hence saving gas.
     */
    struct OrderParam {
        address trader;
        uint256 baseTokenAmount;
        uint256 quoteTokenAmount;
        uint256 gasTokenAmount;
        bytes32 data;
        Signature signature;
    }


    struct OrderAddressSet {
        address baseToken;
        address quoteToken;
        address relayer;
    }

    struct MatchResult {
        address maker;
        address taker;
        address buyer;
        uint256 makerFee;
        uint256 makerRebate;
        uint256 takerFee;
        uint256 makerGasFee;
        uint256 takerGasFee;
        uint256 baseTokenFilledAmount;
        uint256 quoteTokenFilledAmount;
        WalletPath makerWalletPath;
        WalletPath takerWalletPath;
    }
    /**
     * @param takerOrderParam A Types.OrderParam object representing the order from the taker.
     * @param makerOrderParams An array of Types.OrderParam objects representing orders from a list of makers.
     * @param orderAddressSet An object containing addresses common across each order.
     */
    struct MatchParams {
        OrderParam       takerOrderParam;
        OrderParam[]     makerOrderParams;
        uint256[]                baseTokenFilledAmounts;
        OrderAddressSet  orderAddressSet;
    }

    struct MatchSettleResult {
        address incomeToken;
        address outputToken;
        uint256 incomeTokenAmount;
        uint256 outputTokenAmount;
    }
}

library Auction {
    function ratio(Types.Auction memory auction) internal view returns (uint256) {
        uint256 currentRatio = block.number - auction.startBlockNumber;
        return currentRatio < 100 ? currentRatio : 100;
    }
}

library WalletPath {
    function getWallet(Types.WalletPath memory path, Store.State storage state) internal view returns (Types.Wallet storage) {
        if (path.category == Types.WalletCategory.Balance) {
            return state.wallets[path.user];
        } else {
            return state.accounts[path.user][path.marketID].wallet;
        }
    }

    function getBalancePath(
        address user
    )
        internal
        pure
        returns (Types.WalletPath memory)
    {
        return Types.WalletPath({
            user: user,
            category: Types.WalletCategory.Balance,
            marketID: 0
        });
    }

    function getMarketPath(
        address user,
        uint16 marketID
    )
        internal
        pure
        returns (Types.WalletPath memory)
    {
        return Types.WalletPath({
            user: user,
            category: Types.WalletCategory.CollateralAccount,
            marketID: marketID
        });
    }
}


library Order {

    bytes32 public constant EIP712_ORDER_TYPE = keccak256(
        abi.encodePacked(
            "Order(address trader,address relayer,address baseToken,address quoteToken,uint256 baseTokenAmount,uint256 quoteTokenAmount,uint256 gasTokenAmount,bytes32 data)"
        )
    );

    /**
     * Calculates the Keccak-256 EIP712 hash of the order using the Hydro Protocol domain.
     *
     * @param order The order data struct.
     * @return Fully qualified EIP712 hash of the order in the Hydro Protocol domain.
     */
    function getHash(Types.Order memory order) internal pure returns (bytes32 orderHash) {
        orderHash = EIP712.hashMessage(_hashContent(order));
        return orderHash;
    }

    /**
     * Calculates the EIP712 hash of the order.
     *
     * @param order The order data struct.
     * @return Hash of the order.
     */
    function _hashContent(Types.Order memory order) internal pure returns (bytes32 result) {
        /**
         * Calculate the following hash in solidity assembly to save gas.
         *
         * keccak256(
         *     abi.encodePacked(
         *         EIP712_ORDER_TYPE,
         *         bytes32(order.trader),
         *         bytes32(order.relayer),
         *         bytes32(order.baseToken),
         *         bytes32(order.quoteToken),
         *         order.baseTokenAmount,
         *         order.quoteTokenAmount,
         *         order.gasTokenAmount,
         *         order.data
         *     )
         * );
         */

        bytes32 orderType = EIP712_ORDER_TYPE;

        assembly {
            let start := sub(order, 32)
            let tmp := mload(start)

            // 288 = (1 + 8) * 32
            //
            // [0...32)   bytes: EIP712_ORDER_TYPE
            // [32...288) bytes: order
            mstore(start, orderType)
            result := keccak256(start, 288)

            mstore(start, tmp)
        }

        return result;
    }
}

library OrderParam {
    /* Functions to extract info from data bytes in Order struct */

    function getOrderVersion(Types.OrderParam memory order) internal pure returns (uint256) {
        return uint256(uint8(byte(order.data)));
    }

    function getExpiredAtFromOrderData(Types.OrderParam memory order) internal pure returns (uint256) {
        return uint256(uint40(bytes5(order.data << (8*3))));
    }

    function isSell(Types.OrderParam memory order) internal pure returns (bool) {
        return uint8(order.data[1]) == 1;
    }

    function isMarketOrder(Types.OrderParam memory order) internal pure returns (bool) {
        return uint8(order.data[2]) == 1;
    }

    function isMakerOnly(Types.OrderParam memory order) internal pure returns (bool) {
        return uint8(order.data[22]) == 1;
    }

    function isMarketBuy(Types.OrderParam memory order) internal pure returns (bool) {
        return !isSell(order) && isMarketOrder(order);
    }

    function getAsMakerFeeRateFromOrderData(Types.OrderParam memory order) internal pure returns (uint256) {
        return uint256(uint16(bytes2(order.data << (8*8))));
    }

    function getAsTakerFeeRateFromOrderData(Types.OrderParam memory order) internal pure returns (uint256) {
        return uint256(uint16(bytes2(order.data << (8*10))));
    }

    function getMakerRebateRateFromOrderData(Types.OrderParam memory order) internal pure returns (uint256) {
        uint256 makerRebate = uint256(uint16(bytes2(order.data << (8*12))));

        // make sure makerRebate will never be larger than REBATE_RATE_BASE, which is 100
        return Math.min(makerRebate, Consts.REBATE_RATE_BASE());
    }

    function getWalletPathFromOrderData(Types.OrderParam memory order) internal pure returns (Types.WalletPath memory) {
        Types.WalletCategory category;
        uint16 marketID;

        if (byte(order.data << (8*23)) == "\x01") {
            category = Types.WalletCategory.CollateralAccount;
            marketID = uint16(bytes2(order.data << (8*23)));
        } else {
            category = Types.WalletCategory.Balance;
            marketID = 0;
        }

        return Types.WalletPath({
            user: order.trader,
            category: category,
            marketID: marketID
        });
    }
}
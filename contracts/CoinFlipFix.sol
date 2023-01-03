// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

// Contract - hardcoded for Goerli

contract CoinFlipFix is VRFV2WrapperConsumerBase, ConfirmedOwner {
    error WrongInputLength(uint256 desiredLength, uint256 providedInputLength);
    error RequestNotFound();
    error UnableTransferLink();
    event RequestSent(uint256 requestId, bool[] guesses);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );
    event GameResult(
        uint256 requestId,
        bool[] sides,
        bool[] guesses,
        uint8 correctResults,
        bool isWinner
    );

    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
        bool[] sides;
        bool[] guesses;
    }

    mapping(uint256 => RequestStatus)
        public requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    // Configuration for your Network can be found on https://docs.chain.link/vrf/v2/direct-funding/supported-networks

    // Address LINK - hardcoded for Goerli
    address linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;

    // address WRAPPER - hardcoded for Goerli
    address wrapperAddress = 0x708701a1DfF4f478de54383E49a627eD4852C816;
    uint32 callbackGasLimit = 400_000;
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 10;
    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    function flip(bool[] memory _guesses) external returns (uint256 requestId) {
        if (_guesses.length != numWords)
            revert WrongInputLength(numWords, _guesses.length);

        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false,
            sides: new bool[](0),
            guesses: _guesses
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, _guesses);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        if (requests[_requestId].paid == 0) revert RequestNotFound();
        requests[_requestId].fulfilled = true;
        requests[_requestId].randomWords = _randomWords;
        bool[] memory sides = new bool[](10);
        uint256 coinFlip;
        for (uint8 i = 0; i < _randomWords.length; i++) {
            coinFlip = _randomWords[i] / FACTOR;
            sides[i] = coinFlip == 1 ? true : false;
        }
        requests[_requestId].sides = sides;

        emit RequestFulfilled(
            _requestId,
            _randomWords,
            requests[_requestId].paid
        );
        bool[] memory guesses = requests[_requestId].guesses;
        (uint8 correctResults, bool isWinner) = getGameResults(sides, guesses);
        emit GameResult(_requestId, sides, guesses, correctResults, isWinner);
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (
            uint256 paid,
            bool fulfilled,
            uint256[] memory randomWords,
            bool[] memory sides,
            bool[] memory guesses,
            uint8 correctResults,
            bool isWinner
        )
    {
        if (requests[_requestId].paid == 0) revert RequestNotFound();
        RequestStatus memory request = requests[_requestId];
        if (request.fulfilled)
            (correctResults, isWinner) = getGameResults(
                request.sides,
                request.guesses
            );
        paid = request.paid;
        fulfilled = request.fulfilled;
        randomWords = request.randomWords;
        sides = request.sides;
        guesses = request.guesses;
    }

    function getGameResults(
        bool[] memory sides,
        bool[] memory guesses
    ) private pure returns (uint8 correctResults, bool isWinner) {
        for (uint8 i = 0; i < sides.length; i++) {
            if (sides[i] == guesses[i]) correctResults++;
        }
        if (correctResults == sides.length) isWinner = true;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        bool success = link.transfer(msg.sender, link.balanceOf(address(this)));
        if (!success) revert UnableTransferLink();
    }
}

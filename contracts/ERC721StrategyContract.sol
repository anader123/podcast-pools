// pragma solidity 0.6.6;

// // Forked contracts from repo and have them in gitignore
// // import "./poolTogetherContracts/prize-strategy/PeriodicPrizeStrategy.sol";

// contract ERC721StrategyContract is PeriodicPrizeStrategy {

//   function initialize(
//     address _trustedForwarder,
//     uint256 _prizePeriodStart,
//     uint256 _prizePeriodSeconds,
//     PrizePool _prizePool,
//     address _ticket,
//     address _sponsorship,
//     RNGInterface _rng,
//     address[] memory _externalErc20s
//   ) public initializer {
//     PeriodicPrizeStrategy.initialize(
//       _trustedForwarder,
//       _prizePeriodStart,
//       _prizePeriodSeconds,
//       _prizePool,
//       _ticket,
//       _sponsorship,
//       _rng,
//       _externalErc20s
//     );
//   }

//   function _distribute(uint256 randomNumber) internal override {
//     uint256 prize = prizePool.captureAwardBalance();

//     uint256 ownerAmount = prize.mul(.9);
//     uint256 winnerAmount = prize.sub(ownerAmount);

//     address mainWinner = ticket.draw(randomNumber);

//     // owner gets all external and ticket tokens
//     _awardAllExternalTokens(_owner);
//     _awardTickets(_owner, ownerAmount)
//     _awardTickets(mainWinner, winnerAmount)
//     _awardExternalErc721s(mainWinner);
//   }
// }
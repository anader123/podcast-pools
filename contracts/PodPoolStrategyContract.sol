// pragma solidity 0.6.6;

// // import "@pooltogether/pooltogether-contracts/contracts/prize-strategy/PeriodicPrizeStrategy.sol";

// contract PodPoolStrategyContract is PeriodicPrizeStrategy {
//   address private podCreator;

//   function initialize(
//     address _trustedForwarder,
//     uint256 _prizePeriodStart,
//     uint256 _prizePeriodSeconds,
//     PrizePool _prizePool,
//     address _ticket,
//     address _sponsorship,
//     RNGInterface _rng,
//     address[] memory _externalErc20s,
//     address _podCreator
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
//     podCreator = _podCreator;
//   }

//   function awardSponsorship(address user, uint256 amount) internal {
//     prizePool.award(user, amount, address(sponsorship));
//   }

//   function _distribute(uint256 randomNumber) internal override {
//     uint256 prize = prizePool.captureAwardBalance();
//     address mainWinner = ticket.draw(randomNumber);

//     awardSponsorship(podCreator, prize);
//     _awardExternalErc721s(mainWinner);
//   }
// }
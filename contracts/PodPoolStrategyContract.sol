pragma solidity 0.6.12;

// // import "@pooltogether/pooltogether-contracts/contracts/prize-strategy/PeriodicPrizeStrategy.sol";

contract PodPoolStrat is PeriodicPrizeStrategy {
  address private podCreator;

  constructor(PeriodicPrizeStrategy prizeStrategy, address  _podCreator) public {
    prizeStrategy = PeriodicPrizeStrategy(prizeStrategy);

    address[] memory externalErc20s;

    initialize(
      prizeStrategy.trustedForwarder(),
      prizeStrategy.prizePeriodStartedAt(),
      prizeStrategy.prizePeriodSeconds(),
      prizeStrategy.prizePool(),
      address(prizeStrategy.ticket()),
      address(prizeStrategy.sponsorship()),
      prizeStrategy.rng(),
      externalErc20s,
      _podCreator
    );
  }

  function initialize(
    address _trustedForwarder,
    uint256 _prizePeriodStart,
    uint256 _prizePeriodSeconds,
    PrizePool _prizePool,
    address _ticket,
    address _sponsorship,
    RNGInterface _rng,
    address[] memory _externalErc20s,
    address _podCreator
  ) internal initializer {
    PeriodicPrizeStrategy.initialize(
      _trustedForwarder,
      _prizePeriodStart,
      _prizePeriodSeconds,
      _prizePool,
      _ticket,
      _sponsorship,
      _rng,
      _externalErc20s
    );
    podCreator = _podCreator;
  }

  function getAwardErc721TokenIds(address _NftAddress) public view returns(uint256[] memory) {
    return externalErc721TokenIds[_NftAddress];
  }

  function getPodCreator() public view returns(address) {
    return podCreator;
  }

  function awardSponsorship(address user, uint256 amount) internal {
    prizePool.award(user, amount, address(sponsorship));
  }

  function _distribute(uint256 randomNumber) internal override {
    uint256 prize = prizePool.captureAwardBalance();
    address mainWinner = ticket.draw(randomNumber);

    awardSponsorship(podCreator, prize);
    _awardExternalErc721s(mainWinner);
  }
}
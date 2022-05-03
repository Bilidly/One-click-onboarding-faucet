// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BUSDToken is ERC20 {

  address faucet;

  constructor(string memory name, string memory symbol, address _dev, address _faucet) ERC20(name, symbol) {
    faucet = _faucet;
      _mint(_dev, 1000 * (10 ** 18));
      _mint(_faucet, 1000 * (10 ** 18));
  }

  function refill() external {
    _mint(faucet, 1000 * (10 ** 18));
  }
}
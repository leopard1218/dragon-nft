// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YieldToken is ERC20, Ownable {

	uint256 constant public END = 1931622407;

    address public battleContract = 0x0F30e2aeE1FbEAe08E3393a9130ae0B3C366D3F8;
		address public farmContract = 0xce3085aA93Dd92E31D7E75B74aC8aBff1d95d130;
	constructor() ERC20 ("Grass", "GRS") {}

	function mint(uint256 _amount) external onlyOwner {
		_mint(farmContract, _amount);
	}
	function min(uint256 a, uint256 b) internal pure returns (uint256) {
		return a < b ? a : b;
	}

	function burn(address _from, uint256 _amount) external {
		require(msg.sender == address(battleContract) || msg.sender == owner());
		_burn(_from, _amount);
	}

  function setBattleContract(address _battleAddr) external onlyOwner {
    battleContract = _battleAddr;
  }

  function setFarmContract(address _farmAddr) external onlyOwner {
    farmContract = _farmAddr;
  }

}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

interface IDragon {
	function balanceOf(address _user) external view returns(uint256);
}
contract YieldToken is ERC20, Ownable {

	uint256 constant public BASE_RATE = 5 ether; 

	uint256 constant public END = 1931622407;

	mapping(address => uint256) public rewards;
	mapping(address => uint256) public lastUpdate;

	IDragon public  dragonContract;
  address public admin = 0xD4577dA97872816534068B3aa8c9fFEd2ED7860C;
  address public battleContract = 0xD4577dA97872816534068B3aa8c9fFEd2ED7860C;

	constructor(address _dragonAddr) ERC20 ("Grass", "GRS") {
		dragonContract = IDragon(_dragonAddr);
    _mint(admin, 10 ** 25);
	}


	function min(uint256 a, uint256 b) internal pure returns (uint256) {
		return a < b ? a : b;
	}

	function updateReward(address _from, address _to, uint256 _tokenId) external {
		require(msg.sender == address(dragonContract));
		if (_tokenId < 1001) {
			uint256 time = min(block.timestamp, END);
			uint256 timerFrom = lastUpdate[_from];
			if (timerFrom > 0)
				rewards[_from] += dragonContract.balanceOf(_from) * BASE_RATE * (time - timerFrom) / 86400;
			else
			  lastUpdate[_from] = time;
			if (timerFrom != END)
				lastUpdate[_from] = time;
			if (_to != address(0)) {
				uint256 timerTo = lastUpdate[_to];
				if (timerTo > 0)
					rewards[_to] += dragonContract.balanceOf(_to) * BASE_RATE * (time - timerTo) / 86400;
				if (timerTo != END)
					lastUpdate[_to] = time;
			}
		}
	}

	function getReward(address _to) external {
		require(msg.sender == address(dragonContract), "Not dragonContract");
		uint256 reward = rewards[_to];
		if (reward > 0) {
			rewards[_to] = 0;
			_mint(_to, reward);
		}
	}

	function burn(address _from, uint256 _amount) external {
		require(msg.sender == address(battleContract));
		_burn(_from, _amount);
	}

	function getTotalClaimable(address _user) external view returns(uint256) {
		uint256 time = min(block.timestamp, END);
		uint256 pending = dragonContract.balanceOf(_user) * BASE_RATE * (time - lastUpdate[_user]) / 86400;
		return rewards[_user] + pending;
	}

  function setAdmin(address _adminAddr) external onlyOwner {
    admin = _adminAddr;
  }

  function setBattleContract(address _battleAddr) external onlyOwner {
    battleContract = _battleAddr;
  }
 
  function setDragonContract(address _dragonAddr) external onlyOwner {
    dragonContract = IDragon(_dragonAddr);
  } 
}
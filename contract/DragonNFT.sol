// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DragonNFT is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string baseURI;
  string public baseExtension = ".json";
  uint256[5] private PRICES =  [100 ether, 150 ether, 200 ether, 250 ether, 300 ether];
  uint256 public maxSupply = 10000;
  uint256 public maxMintAmount = 20;
  bool public paused = false;
  uint8 private currentPriceId = 0;
  // Admin wallets
  address public constant founderAddress1 = 0x39Ca53E1ad736fbB8A189C470a982AF0f7c866d2;
  address public constant founderAddress2 = 0x75E15FB3358b4a8Eb2344430e7f4d86A8339c2Ff;

  constructor(
    string memory _initBaseURI
  ) ERC721('Dragon', 'DRG') {
    setBaseURI(_initBaseURI);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused);
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount);
    require(supply + _mintAmount <= maxSupply);

    uint256 amountForNextPrice = 2000 - (supply % 2000);
    uint256 estimatedPrice = 0;
    if (_mintAmount > amountForNextPrice) {
      estimatedPrice = PRICES[currentPriceId] * amountForNextPrice + PRICES[currentPriceId + 1] * (_mintAmount - amountForNextPrice);
      currentPriceId += 1;
    } else {
      estimatedPrice = PRICES[currentPriceId] * _mintAmount;
    }
    if (msg.sender != owner()) {
      require(msg.value >= estimatedPrice, "DRAGONS: incorrect price");
    }
    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
    }
  }

  function transferFrom(address from, address to, uint256 tokenId) public override {
		ERC721.transferFrom(from, to, tokenId);
	}

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  function setPrice(uint256 _newPrice) external onlyOwner() {
    PRICES[currentPriceId] = _newPrice;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) external onlyOwner() {
    maxMintAmount = _newmaxMintAmount;
  }
  
  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
  function withdrawAll() external onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "Insufficent balance");
    _withdraw(founderAddress1, ((balance * 50) / 100));
    _withdraw(founderAddress2, address(this).balance);    
  }

  function _withdraw(address _address, uint256 _amount) private {
    (bool success, ) = _address.call{ value: _amount }("");
    require(success, "Failed to withdraw Ether");
  } 

  function getCurrentPrice() external view returns (uint256) {
    return PRICES[currentPriceId];
  } 
}
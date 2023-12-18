//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleHashValidator} from "./MerkleHashValidator.sol";


contract Airdrop is Ownable {

    IERC20 public immutable airdropToken;

    bytes32 public immutable merkleRoot;

    address public immutable signer;

    bool public isECDSADisabled;

    mapping(address => bool) public alreadyClaimed;

    bytes32 public immutable EIP712_DOMAIN;

    bytes32 public constant SUPPORT_TYPEHASH = keccak256("Claim(address claimer,uint256 amount)");

    constructor(bytes32 _root, address _signer, IERC20 _airdropToken) {
        merkleRoot = _root;
        signer = _signer;
        airdropToken = _airdropToken;

        EIP712_DOMAIN = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("Airdrop")),
            keccak256(bytes("v1")),
            block.chainid,
            address(this)
        ));
    }

    function signatureClaim(bytes calldata signature, address _to, uint256 _amount) external {
        require(!isECDSADisabled, "SIGS_DISABLED");
        //make sure the user hasnt already claimed
        require(!alreadyClaimed[_to], "signatureClaim: User has already claimed airdrop");
        //create digest format of signature to pass into recover function
        bytes32 digest = toTypedDataHash(_to, _amount);
        //use recover function to get the sigSigner of this signature
        address sigSigner = ECDSA.recover(digest, signature);
        //require sigSigner is signer (as defined in constructor)
        require(sigSigner == signer, "signatureClaim: This signature was not signed by the Airdrop signer");
        //require signer is not the 0 address
        require(sigSigner != address(0), "signatureClaim: invalid input signature");
        //add user to mapping of already claimed users
        alreadyClaimed[_to] = true;
        //send airdrop tokens to user
        airdropToken.transfer(_to, _amount);
        //emit Claimed event 
        emit Claimed(_to, _amount);
    }

    function merkleClaim(bytes32[] calldata _proof, address _to, uint256 _amount) external {
        require(!alreadyClaimed[_to], "merkleClaim: User has already claimed airdrop");
        //generate node from address and amount
        bytes32 _node = keccak256(abi.encodePacked(_to, _amount));
        //check if node is valid
        bool isValidProof = MerkleHashValidator.validateEntry(merkleRoot, _proof, _node);
        require(isValidProof, 'merkleClaim: Incorrect proof');
        //add user to mapping of already claimed users
        alreadyClaimed[_to] = true;
        //send airdrop tokens to user
        airdropToken.transfer(_to, _amount);
        //emit Claimed event
        emit Claimed(_to, _amount);
    }

    function disableECDSAVerification() external onlyOwner {
        isECDSADisabled = true;
        emit ECDSADisabled(msg.sender);
    }

    function toTypedDataHash(address _claimer, uint256 _amount) internal view returns (bytes32) {
        bytes32 structHash = keccak256(abi.encode(SUPPORT_TYPEHASH, _claimer, _amount));
        return ECDSA.toTypedDataHash(EIP712_DOMAIN, structHash);
    }

    function toLeafFormat(address _claimer, uint256 _amount) internal pure returns (bytes32) {
        return keccak256(bytes(abi.encode(_claimer, _amount)));
    }

    event ECDSADisabled(address owner);
    event Claimed(address addr, uint256 amount);
}
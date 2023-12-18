//simple merkletree generating code for testing

const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const Web3 = require("web3");

const web3 = new Web3();

function generateMerkleTree(leaves: [string,string][]){
    let balances:any = [];
    leaves.forEach(function (leaf){
        balances.push({
            addr: leaf[0],
            amount: web3.eth.abi.encodeParameter("uint256",leaf[1]) 
        });
    });
    const leafNodes = balances.map((balance:any) =>
        keccak256(
            Buffer.concat([
            Buffer.from(balance.addr.replace("0x", ""), "hex"),
            Buffer.from(balance.amount.replace("0x", ""), "hex"),
            ])
        )
    );

    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    let leafProofs:any = [];
    leafNodes.forEach(function (leaf:string){
        leafProofs.push(merkleTree.getHexProof(leaf));
    });

    let returnValues = {
        merkleroot: merkleTree.getHexRoot(),
        leafProofs: leafProofs
    };

    return returnValues;
}

export default generateMerkleTree;
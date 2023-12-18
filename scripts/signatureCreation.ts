var ethSigUtil = require('eth-sig-util');
import {Constants} from "../constants"

function createSignature(claimer:string, amount:string, contract:string, cid:number)
{
    const domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
    ]
    
    const EDCSAClaim = [
        { name: "claimer", type: "address" },
        { name: "amount", type: "uint256" },
    ]
    
    const MerkleClaim = [
        { name: "claimer", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "merkleProof", type: "bytes32[]" },
    ]
    
    const domainData = {
        name: "Airdrop",
        version: "v1",
        chainId: cid,
        verifyingContract: contract
    };
    const Claim = {
        "claimer": claimer,
        "amount": amount,
    };
    
    let data = {
        types: {
            EIP712Domain: domain,
            Claim: EDCSAClaim,
        },
        primaryType: "Claim",
        domain: domainData,
        message: Claim
    };
    
    const sig = ethSigUtil.signTypedData_v4(Buffer.from(Constants.pkey, 'hex'), {data}); //v4 is the most up to date version
    return sig;
}

export default createSignature;
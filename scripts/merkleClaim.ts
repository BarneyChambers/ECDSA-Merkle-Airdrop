  /*
    Example for claiming 0.1 airdrop tokens by user 0x87Dcc908dfA37fc192260f69522870cA83618e67
    used purely during development for testing purposes
  */

import { ethers } from "hardhat";

async function main() {

    const Airdrop = await ethers.getContractFactory("Airdrop");
    const contract = await Airdrop.attach(
      ""
    );
    
    let proof = ["0xbe97a73c9185431c9ead01447955e9d2f9da8ef051f3a32eefff7f6af998416e"]
    let to = '0x87Dcc908dfA37fc192260f69522870cA83618e67';
    let amount = "100000000000000000"; //0.1
    
    let result = await contract.merkleClaim(proof, to, amount);
    console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

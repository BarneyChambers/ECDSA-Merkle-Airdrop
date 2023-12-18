import { ethers } from "hardhat";

async function main() {}

async function signatureClaim(contractAddress:string, sig:string, to:string, amount:number){
  
  let Airdrop = await ethers.getContractFactory("Airdrop");
  let contract = await Airdrop.attach(contractAddress);
  let result = await contract.signatureClaim(sig, to, amount);
  return result;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export default signatureClaim;
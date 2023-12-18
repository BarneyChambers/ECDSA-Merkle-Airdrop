import { ethers } from "hardhat";
import {Constants} from "../constants"

async function main() {

  const AirdropToken = await ethers.getContractFactory("AirdropToken");
  const airdropToken = await AirdropToken.deploy("Airdrop Token", "AIRDROP");

  await airdropToken.deployed();

  console.log('deployed token address: ');
  console.log(airdropToken.address);

  const Airdrop = await ethers.getContractFactory("Airdrop");
  const airdrop = await Airdrop.deploy(Constants.merkleRoot, Constants.airdropSigner, airdropToken.address);

  await airdrop.deployed();
  console.log('deployed airdrop address: ');
  console.log(airdrop.address);

  console.log('minting tokens and sending to airdrop contract');

  await airdropToken.mint(airdrop.address, "1000000000000000000000"); //1000 tokens
  console.log('done minting');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

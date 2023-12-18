import { HardhatUserConfig } from "hardhat/config";
import {Constants} from "./constants"
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    matic: {
      url: ``,
      accounts: [Constants.pkey]
    }
  }
};

export default config;
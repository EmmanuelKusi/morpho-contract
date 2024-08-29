import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  
  export async function deployiTokenFaucet() {
    const [owner, otherAccount] = await ethers.getSigners();
  
    const iTokenContract = await ethers.getContractFactory("IToken");
    const iToken = await iTokenContract.deploy();
  
    const iTokenFaucet = await ethers.getContractFactory("ITokenFaucet");
    const faucet = await iTokenFaucet.deploy(iToken);
  
    await iToken.transfer(await faucet.getAddress(), BigInt(1e24));
  
    return { iToken, owner, otherAccount, faucet };
  }
  
  describe("iTokenFaucet", function () {
    describe("Deployment", function () {
      it("Should Deploy", async function () {
        await loadFixture(deployiTokenFaucet);
      });
    });
  
    describe("Claim iToken", function () {
      it("Should Claim iToken", async function () {
        const { faucet, otherAccount } = await loadFixture(deployiTokenFaucet);
        await expect(faucet.connect(otherAccount).claim())
          .emit(faucet, "Claimed")
          .withArgs(await otherAccount.getAddress(), await faucet.dailyClaim());
  
        await expect(
          faucet.connect(otherAccount).claim()
        ).revertedWithCustomError(faucet, "AlreadyClaimed");
  
      });
    });
  });
  
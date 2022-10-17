const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {

    // Old before the fixture
    //   it("Deployment should assign the total supply of tokens to the owner", async function () {
    //     const [owner] = await ethers.getSigners();

    //     const Token = await ethers.getContractFactory("Token"); 

    //     const hardhatToken = await Token.deploy();

    //     const ownerBalance = await hardhatToken.balanceOf(owner.address);
    //     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    //   });

    // it("Should transfer tokens between accounts", async function() {
    //     const [owner, addr1, addr2] = await ethers.getSigners();

    //     const Token = await ethers.getContractFactory("Token");

    //     const hardhatToken = await Token.deploy();

    //     console.log("Balance before");
    //     console.log(await hardhatToken.balanceOf(addr2.address));

    //     // Transfer 50 tokens from owner to addr1
    //     await hardhatToken.transfer(addr1.address, 50);
    //     expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

    //     // Transfer 50 tokens from addr1 to addr2
    //     await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    //     expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);

    //     console.log("Balance after");
    //     console.log( await hardhatToken.balanceOf(addr2.address));
    //   });

    // after fixture

    // You can avoid code duplication and improve the performance 
    // of your test suite by using fixtures. A fixture is a setup 
    // function that is run only the first time it's invoked. On 
    // subsequent invocations, instead of re-running it, Hardhat 
    // will reset the state of the network to what it was at the 
    // point after the fixture was initially executed.

    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory("Token");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const hardhatToken = await Token.deploy();

        await hardhatToken.deployed();

        // Fixtures can return anything you consider useful for your tests
        return { Token, hardhatToken, owner, addr1, addr2 };
    }

    it("Should assign the total supply of tokens to the owner", async function () {
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });



    it("Should transfer tokens between accounts", async function () {
        const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        // Transfer 50 tokens from owner to addr1
        await expect(
            hardhatToken.transfer(addr1.address, 50)
        ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

        // Transfer 50 tokens from addr1 to addr2
        // We use .connect(signer) to send a transaction from another account
        await expect(
            hardhatToken.connect(addr1).transfer(addr2.address, 50)
        ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });
});


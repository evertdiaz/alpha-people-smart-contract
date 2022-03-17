const { expect } = require('chai');

describe('Alpha Contract', () => {
  const setup = async ({maxSupply = 10000}) => {
    const [owner] = await ethers.getSigners();
    const PunkPpl = await ethers.getContractFactory("AlphaPeople");
    const deployed = await PunkPpl.deploy(maxSupply);

    return {
      owner,
      deployed
    }

  }

  describe('Deployment', () => {
    it('Sets max supply to passed param', async() => {
      const maxSupply = 4000;

      const { deployed } = await setup({ maxSupply });

      const returnedMaxSupply = await deployed.maxSupply();

      expect(maxSupply).to.equal(returnedMaxSupply);
    })
  })

  describe('Minting', () => {
    it('Mints new token and assign to contract owner', async () => {
      const maxSupply = 4000;
      const { owner, deployed } = await setup({ maxSupply });

      await deployed.mint();

      const ownerOfMinted = await deployed.ownerOf(0);

      expect(ownerOfMinted).to.equal(owner.address);
    })
    it('Has a minting limit', async () => {
      const maxSupply = 2;
      const { deployed } = await setup({ maxSupply });
      await Promise.all([
        deployed.mint(),
        deployed.mint()
      ])
      

      // Assert last minting
      await expect(deployed.mint()).to.be.revertedWith("No NFT lefts to mint")
    });
  })

  describe('TokenURI', () => {
    it('returns valid metadata', async() => {
      const { deployed } = await setup({ });

      await deployed.mint();

      const tokenURI = await deployed.tokenURI(0);
      const stringifiedTokenURI = await tokenURI.toString();
      const [prefix, base64JSON] = stringifiedTokenURI.split('data:application/json;base64,');
      const stringifiedMetadata = await Buffer.from(base64JSON, 'base64').toString('ascii');

      const metadata = JSON.parse(stringifiedMetadata);

      expect (metadata).to.have.all.keys('name', 'description', 'image');
    })
  });
})
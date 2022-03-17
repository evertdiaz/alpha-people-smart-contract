const deploy = async () => {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contract with the account: ${deployer.address}`)

  const AlphaPeople = await ethers.getContractFactory("AlphaPeople");
  const deployed = await AlphaPeople.deploy(1000);

  console.log(`Alpha People was deployed at ${deployed.address}`);
};

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
});
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { owner, alice } = await getNamedAccounts();

  await deploy("NiftyA", {
    from: owner,
    args: [],
    log: true,
  });

  await deploy("NiftyB", {
    from: alice,
    args: [],
    log: true,
  });

  await deploy("TestShwap", {
    from: owner,
    args: [],
    log: true,
  });
};
module.exports.tags = ["NiftyA", "NiftyB", "Shwap"];

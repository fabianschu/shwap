module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { owner } = await getNamedAccounts();

  await deploy("NiftyA", {
    from: owner,
    args: [],
    log: true,
  });
};
module.exports.tags = ["NiftyA"];

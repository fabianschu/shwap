module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { owner, alice } = await getNamedAccounts();

  await deploy("NiftyA", {
    from: alice,
    contract: "TToken",
    args: ["aaa", "AAA"],
    log: true,
  });

  await deploy("NiftyB", {
    from: alice,
    contract: "TToken",
    args: ["bbb", "BBB"],
    log: true,
  });

  await deploy("TradeHub", {
    from: owner,
    args: [],
    log: true,
  });

  await deploy("TestTradeHub", {
    from: owner,
    args: [],
    log: true,
  });
};
module.exports.tags = ["NiftyA", "NiftyB", "TradeHub", "TestTradeHub"];

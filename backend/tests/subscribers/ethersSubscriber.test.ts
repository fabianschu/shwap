import express from "express";
import { getConnection, getRepository, Repository } from "typeorm";
import { privateToAddress } from "ethereumjs-util";
import loader from "../../src/loaders";
import { User } from "../../src/entity/User";
import WS from "jest-websocket-mock";

const app = express();

describe("subscriber", () => {
  let server: WS;

  beforeAll(async () => {
    server = new WS("ws://localhost:1234");
    console.log("server created");
    console.log("import client");
    let client: any = await import("../../src/loaders/ethers");
    console.log("client imported");

    console.log("connect server");
    await server.connected;
    client.send("hello");
  });

  afterAll(() => {
    server.close();
    WS.clean();
  });

  it("receives a message", async () => {
    server.send("hello everyone");
  });
});

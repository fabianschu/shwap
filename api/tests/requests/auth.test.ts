import request from "supertest";
import express from "express";
import { getConnection, getRepository, Repository } from "typeorm";
import { privateToAddress } from "ethereumjs-util";
import loader from "../../src/loaders";
import { User } from "../../src/entity/User";

const hexString =
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const privateKey = Buffer.from(hexString, "hex");
const publicAddress = privateToAddress(privateKey).toString("hex");
const app = express();

describe("auth route", () => {
  let userRepository: Repository<User>;

  beforeAll(async () => {
    await loader({ expressApp: app });
    userRepository = getRepository(User);
  });

  afterAll(async () => {
    const dbConnection = getConnection("default");
    await dbConnection.close();
  });

  describe("GET /users/:pubAddr", () => {
    describe("without parameter", () => {
      it("should return 404", (done) => {
        request(app).get(`/api/users`).send().expect(404).end(done);
      });
    });

    describe("without valid public address", () => {
      it("should return 400", (done) => {
        request(app)
          .get(`/api/users/lala`)
          .send()
          .expect(400)
          .expect({ error: "User not found" })
          .end(done);
      });
    });

    describe("with valid public address", () => {
      beforeEach(async () => {
        await userRepository.save({ pubAddr: publicAddress, nonce: "123456" });
      });

      afterEach(async () => {
        const user = await userRepository.findOne();
        await userRepository.delete(user.id);
      });

      it("should return the user", async (done) => {
        request(app)
          .get(`/api/users/${publicAddress}`)
          .send()
          .expect(200)
          .expect({ pubAddr: publicAddress, nonce: "123456" })
          .end(done);
      });
    });
  });

  describe("POST /users/SignUp", () => {
    describe("without parameter", () => {
      it("should return 400", (done) => {
        request(app).post(`/api/users/signup`).send().expect(400).end(done);
      });
    });

    describe("with valid parameters", () => {
      afterEach(async () => {
        const user = await userRepository.findOne();
        await userRepository.delete(user.id);
      });

      it("should get a success status code", (done) => {
        request(app)
          .post(`/api/users/signup`)
          .send({ pubAddr: publicAddress })
          .set("Accept", "application/json")
          .expect(200)
          .end(done);
      });
    });

    describe("with already existing customer", () => {
      beforeEach(async () => {
        await userRepository.save({ pubAddr: publicAddress, nonce: "123456" });
      });

      afterEach(async () => {
        const user = await userRepository.findOne();
        await userRepository.delete(user.id);
      });

      it("should receive an error 409", (done) => {
        request(app)
          .post(`/api/users/signup`)
          .send({ pubAddr: publicAddress })
          .set("Accept", "application/json")
          .expect(409)
          .end(done);
      });
    });
  });

  describe("POST /users/SignIn", () => {
    describe("without necessary parameters", () => {
      it("should return 400", (done) => {
        request(app).post(`/api/users/signin`).send().expect(400).end(done);
      });
    });
  });
});

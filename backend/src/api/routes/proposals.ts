import { Router, Request, Response, NextFunction } from "express";
import { Repository } from "typeorm";
import { Container } from "typedi";
import { IProposal } from "../../interfaces/IProposal";
import { IUserRequest } from "../../interfaces/IExpress";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/proposals", route);
  const proposalRepository: Repository<IProposal> = Container.get(
    "proposalRepository"
  );
  // route.get(
  //   "/users/:pubAddr",
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const { pubAddr } = req.params;
  //     const user = await userRepository.findOne({ pubAddr });
  //     if (!user) return res.status(400).json({ error: "User not found" });
  //     return res.json({ pubAddr, nonce: user.nonce }).status(200);
  //   }
  // );

  route.post(
    "/",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req: IUserRequest, res: Response, next: NextFunction) => {
      const { offerAddress, wantedAddress } = req.body;
      if (!offerAddress && !wantedAddress)
        return res.status(400).json({ error: "Public Address required" });
      try {
        const proposal = await proposalRepository.save(req.body);
        return res.json(proposal).status(200);
      } catch (e) {
        return next(e);
      }
    }
  );

  // route.post(
  //   "/users/signin",
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     if (!req.body.signedNonce)
  //       return res.status(400).json("Signed nonce required");
  //     const { user, token, message } = await authServiceInstance.SignIn(
  //       req.body as IUserInputDTO
  //     );
  //     if (message) return res.status(400).json(message);
  //     // return res.json(id).status(200);
  //   }
  // );
};

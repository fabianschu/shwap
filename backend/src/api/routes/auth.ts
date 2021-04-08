import { Router, Request, Response, NextFunction } from "express";
import { Repository } from "typeorm";
import { Container } from "typedi";
import AuthService from "../../services/authService";
import { IUserInputDTO, IUser } from "../../interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);
  const userRepository: Repository<IUser> = Container.get("userRepository");
  const authServiceInstance = Container.get(AuthService);

  route.get(
    "/:pubAddr",
    async (req: Request, res: Response, next: NextFunction) => {
      const { pubAddr } = req.params;
      const user = await userRepository.findOne({ pubAddr });
      if (!user) return res.status(400).json({ error: "User not found" });
      return res.json({ pubAddr, nonce: user.nonce }).status(200);
    }
  );

  route.post(
    "/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.pubAddr)
        return res.status(400).json({ error: "Public Address required" });
      const { pubAddr, nonce, message } = await authServiceInstance.SignUp(
        req.body as IUserInputDTO
      );
      if (message) return res.status(409).json(message);
      return res.json({ pubAddr, nonce }).status(200);
    }
  );

  route.post(
    "/signin",
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.signedNonce)
        return res.status(400).json("Signed nonce required");
      const { user, token, message } = await authServiceInstance.SignIn(
        req.body as IUserInputDTO
      );
      if (message) return res.status(400).json(message);
      // return res.json(id).status(200);
    }
  );
};

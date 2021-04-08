import { Router } from "express";
import auth from "./routes/auth";
import proposals from "./routes/proposals";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  proposals(app);

  return app;
};

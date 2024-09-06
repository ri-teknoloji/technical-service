import { User } from "@prisma/client"; // User modelinizin olduğu yerden import edin

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

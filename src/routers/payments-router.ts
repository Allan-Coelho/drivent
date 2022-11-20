import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from "@/controllers";
import { createEnrollmentSchema } from "@/schemas";

const paymentsRouter = Router();

paymentsRouter
  .get("/cep", getAddressFromCEP)
  .all("/*", authenticateToken)
  .get("/", getEnrollmentByUser)
  .post("/", validateBody(createEnrollmentSchema), postCreateOrUpdateEnrollment);

export { paymentsRouter };

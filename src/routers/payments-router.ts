import { Router } from "express";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { getPaymentByTicketId, postPaymentByTicketId } from "@/controllers";
import { paymentSchema } from "@/schemas/payments-schemas";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPaymentByTicketId)
  .post("/process", validateBody(paymentSchema), postPaymentByTicketId);

export { paymentsRouter };

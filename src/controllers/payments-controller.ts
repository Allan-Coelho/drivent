import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/enrollments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    return res.status(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    return res.status(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { missingTicketId } from "@/services/payments-service/errors";
import { Response } from "express";
import httpStatus from "http-status";
import { PaymentProcess } from "@/protocols";

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId } = req.query;
    if (ticketId === undefined) throw missingTicketId();
    const { userId } = req;

    const payment = await paymentsService.getPaymentByTicketId(Number(ticketId), userId);

    return res.send(payment);
  } catch (error) {
    if (error.name === "TicketNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }

    if (error.name === "MissingTicketId") {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }

    if (error.name === "UnauthorizedUser") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const data = req.body as PaymentProcess;
    const payment = await paymentsService.postPaymentByTicketId(data, userId);

    return res.send(payment);
  } catch (error) {
    if (error.name === "TicketNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }

    if (error.name === "UnauthorizedUser") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

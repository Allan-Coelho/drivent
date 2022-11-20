import { AuthenticatedRequest } from "@/middlewares";
import { ApplicationError } from "@/protocols";
import ticketsService from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketsTypes();
    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const ticket = await ticketsService.getUserTickets(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const typeId: number = req.body.ticketTypeId;
    const { userId } = req;
    const ticketCreated = await ticketsService.createTicket(userId, typeId);
    console.log(ticketCreated);
    return res.status(httpStatus.CREATED).send(ticketCreated);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

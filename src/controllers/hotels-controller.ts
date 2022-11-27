import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "EnrollmentNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if (error.name === "TicketNotFound") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }

    if (error.name === "PendentPayment") {
      return res.status(httpStatus.NO_CONTENT).send(error.message);
    }

    if (error.name === "TicketIsRemote") {
      return res.status(httpStatus.NO_CONTENT).send(error.message);
    }

    if (error.name === "DoesNotIncludeHotel") {
      return res.status(httpStatus.NO_CONTENT).send(error.message);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  try {
    const { hotelId } = req.params;
    const hotel = await hotelsService.getHotelsById(Number(hotelId));

    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === "HotelNotFound") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

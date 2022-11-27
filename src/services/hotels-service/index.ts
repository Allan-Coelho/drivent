import ticketsRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import {
  doesNotIncludeHotel,
  enrollmentNotFound,
  hotelNotFound,
  pendentPayment,
  ticketIsRemote,
  ticketNotFound,
} from "./errors";
import { TicketStatus } from "@prisma/client";

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (enrollment === null) throw enrollmentNotFound();
  const ticket = await ticketsRepository.findTicketsByEnrollmentId(enrollment.id);
  if (ticket === null) throw ticketNotFound();
  if (ticket.TicketType.isRemote) throw ticketIsRemote();
  if (!ticket.TicketType.includesHotel) throw doesNotIncludeHotel();
  if (ticket.status !== TicketStatus.PAID) throw pendentPayment();
  const hotels = await hotelsRepository.getHotels();

  return hotels;
}

async function getHotelsById(hotelId: number) {
  const hotel = await hotelsRepository.getHotelsById(hotelId);
  if (hotel === null) throw hotelNotFound();

  return hotel;
}

const hotelsService = {
  getHotels,
  getHotelsById,
};

export default hotelsService;

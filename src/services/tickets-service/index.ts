import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";
import { enrollmentNotFound, ticketNotFound } from "./errors";

async function getTicketsTypes() {
  const result: Array<TicketType> = await ticketsRepository.findAllTicketTypes();
  return result;
}

async function getUserTickets(userId: number) {
  const userEnrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (userEnrollment === null) throw enrollmentNotFound();
  const userTicket: Ticket = await ticketsRepository.findTicketsByEnrollmentId(userEnrollment.id);
  if (userTicket === null) throw ticketNotFound();

  return userTicket;
}

async function createTicket(userId: number, typeId: number) {
  const userEnrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (userEnrollment === null) throw enrollmentNotFound();
  await ticketsRepository.createTicket(typeId, userEnrollment.id);
  const userTicket: Ticket = await ticketsRepository.findTicketsByEnrollmentId(userEnrollment.id);

  return userTicket;
}

const ticketsService = {
  getTicketsTypes,
  getUserTickets,
  createTicket,
};

export default ticketsService;

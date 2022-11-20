import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";

async function getTicketsTypes() {
  const result: Array<TicketType> = await ticketsRepository.findAllTicketTypes();
  return result;
}

async function getUserTickets(userId: number) {
  const userEnrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  const userTicket: Ticket = await ticketsRepository.findTicketsByEnrollmentId(userEnrollment.id);

  if (userEnrollment === null || userTicket === null) throw notFoundError();

  return userTicket;
}

async function createTicket(userId: number, typeId: number) {
  const userEnrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (userEnrollment === null) throw notFoundError();
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

import paymentRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { ticketNotFound, unauthorizedUser } from "./errors";

async function getPaymentByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.findTicketById(ticketId);

  if (ticket === null) throw ticketNotFound();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);
  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);

  if (enrollment.userId !== userId) throw unauthorizedUser();

  return payment;
}

async function postPaymentByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.findTicketById(ticketId);
  if (ticket === null) throw ticketNotFound();
  const payment = await paymentRepository.getPaymentByTicketId(ticketId);
  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);
  if (enrollment.userId !== userId) throw unauthorizedUser();
  return payment;
}

const ticketsService = {
  getPaymentByTicketId,
  postPaymentByTicketId,
};

export default ticketsService;

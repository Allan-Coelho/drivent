import paymentRepository from "@/repositories/payment-repository";
import ticketsRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { ticketNotFound, unauthorizedUser } from "./errors";
import { PaymentProcess, CardDigits } from "@/protocols";

async function getPaymentByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsRepository.findTicketById(ticketId);

  if (ticket === null) throw ticketNotFound();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);
  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);

  if (enrollment.userId !== userId) throw unauthorizedUser();

  return payment;
}

async function postPaymentByTicketId(data: PaymentProcess, userId: number) {
  const ticket = await ticketsRepository.findTicketById(data.ticketId);
  if (ticket === null) throw ticketNotFound();
  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);
  if (enrollment.userId !== userId) throw unauthorizedUser();
  const ticketType = await ticketsRepository.findTicketsByEnrollmentId(enrollment.id);
  const cardLastDigits = data.cardData.number.toString().slice(CardDigits.LastDigits);

  await ticketsRepository.updateTicketStatus(data.ticketId);

  const payment = await paymentRepository.createPayment(
    data.ticketId,
    ticketType.TicketType.price,
    data.cardData.issuer,
    cardLastDigits,
  );

  return payment;
}

const ticketsService = {
  getPaymentByTicketId,
  postPaymentByTicketId,
};

export default ticketsService;

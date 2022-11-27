import { prisma } from "@/config";
import { CardIssuer } from "@/protocols";

async function getPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, value: number, cardIssuer: CardIssuer, cardLastDigits: string) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer,
      cardLastDigits,
    },
  });
}

const paymentRepository = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentRepository;

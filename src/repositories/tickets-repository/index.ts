import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

function findAllTicketTypes() {
  return prisma.ticketType.findMany();
}

function findTicketsByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId: enrollmentId },
    include: { TicketType: true },
  });
}

function createTicket(typeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      status: TicketStatus.RESERVED,
      ticketTypeId: typeId,
      enrollmentId: enrollmentId,
    },
  });
}
const ticketsRepository = {
  findAllTicketTypes,
  findTicketsByEnrollmentId,
  createTicket,
};

export default ticketsRepository;

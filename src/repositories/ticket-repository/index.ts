import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

async function findAllTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findTicketsByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

async function findTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
  });
}

async function createTicket(typeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      status: TicketStatus.RESERVED,
      ticketTypeId: typeId,
      enrollmentId: enrollmentId,
    },
  });
}

async function updateTicketStatus(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status: TicketStatus.PAID },
  });
}
const ticketsRepository = {
  findAllTicketTypes,
  findTicketsByEnrollmentId,
  createTicket,
  findTicketById,
  updateTicketStatus,
};

export default ticketsRepository;

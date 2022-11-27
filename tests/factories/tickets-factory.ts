import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

export async function createTicketType(isRemote?: boolean, includesHotel?: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote === undefined ? faker.datatype.boolean() : isRemote,
      includesHotel: includesHotel === undefined ? faker.datatype.boolean() : includesHotel,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

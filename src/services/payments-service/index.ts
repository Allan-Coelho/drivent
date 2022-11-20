import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import dayjs from "dayjs";

async function getTicketsTypes(): Promise {
  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  return exclude(event, "createdAt", "updatedAt");
}

const ticketsService = {
  getTicketsTypes,
};

export default ticketsService;

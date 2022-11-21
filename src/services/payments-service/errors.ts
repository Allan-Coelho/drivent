import { ApplicationError } from "@/protocols";

export function missingTicketId(): ApplicationError {
  return {
    name: "MissingTicketId",
    message: "The ticket id is missing",
  };
}

export function ticketNotFound(): ApplicationError {
  return {
    name: "TicketNotFound",
    message: "Ticket not found",
  };
}

export function unauthorizedUser(): ApplicationError {
  return {
    name: "UnauthorizedUser",
    message: "Unauthorized User",
  };
}

import { ApplicationError } from "@/protocols";

export function enrollmentNotFound(): ApplicationError {
  return {
    name: "EnrollmentNotFound",
    message: "The user does not have an enrollment",
  };
}

export function ticketNotFound(): ApplicationError {
  return {
    name: "TicketNotFound",
    message: "The user does not have tickets yet",
  };
}

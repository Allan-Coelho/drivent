import { ApplicationError } from "@/protocols";

export function enrollmentNotFound(): ApplicationError {
  return {
    name: "EnrollmentNotFound",
    message: "The user does not have an enrollment",
  };
}

export function pendentPayment(): ApplicationError {
  return {
    name: "PendentPayment",
    message: "This ticket isn't paid",
  };
}

export function ticketIsRemote(): ApplicationError {
  return {
    name: "TicketIsRemote",
    message: "The user bought an remote ticket",
  };
}

export function doesNotIncludeHotel(): ApplicationError {
  return {
    name: "DoesNotIncludeHotel",
    message: "This ticket doesn't include hotel",
  };
}

export function hotelNotFound(): ApplicationError {
  return {
    name: "HotelNotFound",
    message: "This hotel id doesn't exist",
  };
}

export function ticketNotFound(): ApplicationError {
  return {
    name: "TicketNotFound",
    message: "The user does not have tickets yet",
  };
}

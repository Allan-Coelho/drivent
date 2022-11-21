import Joi from "joi";

export const createTicketSchema = Joi.object({
  ticketTypeId: Joi.number().integer().required(),
});

export const ticketIdSchema = Joi.object({
  ticketId: Joi.number().integer().required(),
});

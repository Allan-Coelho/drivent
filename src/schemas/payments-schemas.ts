import Joi from "joi";

export const paymentSchema = Joi.object({
  ticketId: Joi.number().integer().required(),
  cardData: {
    issuer: Joi.string().allow("MASTERCARD", "VISA"),
    number: Joi.number().integer().min(100000000000000).max(999999999999999).required(),
    name: Joi.string().min(1).required(),
    expirationDate: Joi.string().min(6).required(),
    cvv: Joi.number().min(100).max(999),
  },
});

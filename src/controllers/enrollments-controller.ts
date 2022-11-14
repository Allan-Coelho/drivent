import { AuthenticatedRequest } from "@/middlewares";
import { cepValidationSchema } from "@/schemas";
import enrollmentsService from "@/services/enrollments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

    return res.status(httpStatus.OK).send(enrollmentWithAddress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    const query = await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      ...req.body,
      userId: req.userId,
    });

    if (query.error) return res.sendStatus(httpStatus.BAD_REQUEST);

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
  const { cep } = req.query as Record<string, string>;

  try {
    const { value, error } = cepValidationSchema.validate(cep);
    if (error !== undefined) return res.sendStatus(httpStatus.NO_CONTENT);
    const address = await enrollmentsService.getAddressFromCEP(cep);

    res.status(httpStatus.OK).send(address);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NO_CONTENT);
    }
  }
}

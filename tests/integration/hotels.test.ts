import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket } from "../factories";
import { cleanDb, cleanHotels, generateValidToken } from "../helpers";
import { Hotel, TicketStatus } from "@prisma/client";
import { createHotel, createRoom } from "../factories/hotels-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);
const route = "/hotels";

describe(`GET ${route}`, () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get(route);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get(route).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get(route).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    describe("should respond with status 204", () => {
      it("if user ticket type is remote", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
        const ticketType = await createTicketType(true, false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const response = await server.get(route).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NO_CONTENT);
      });

      it("if user ticket isn't paid", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const response = await server.get(route).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NO_CONTENT);
      });

      it("if user ticket doesn't include hotel", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
        const ticketType = await createTicketType(false, false);

        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const response = await server.get(route).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NO_CONTENT);
      });
    });

    describe("should respond with status 200 and hotels", () => {
      it("if user ticket isn't remote, includes hotel and is paid", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const response = await server.get(route).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining<Omit<Hotel, "createdAt" | "updatedAt">>({
              name: hotel.name,
              id: hotel.id,
              image: hotel.image,
            }),
          ]),
        );
      });
      it("if has hotel id specified", async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const token = await generateValidToken(user);
        const ticketType = await createTicketType(false, true);
        const hotel = await createHotel();
        await createRoom(hotel.id);
        const hotelWithRooms = await prisma.hotel.findFirst({
          where: { id: hotel.id },
          include: {
            Rooms: true,
          },
        });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const response = await server.get(`${route}/${hotel.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: hotelWithRooms.id,
          name: hotelWithRooms.name,
          image: hotelWithRooms.image,
          createdAt: hotelWithRooms.createdAt.toISOString(),
          updatedAt: hotelWithRooms.updatedAt.toISOString(),
          Rooms: [
            {
              id: hotelWithRooms.Rooms[0].id,
              name: hotelWithRooms.Rooms[0].name,
              capacity: hotelWithRooms.Rooms[0].capacity,
              hotelId: hotelWithRooms.Rooms[0].hotelId,
              createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
              updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
            },
          ],
        });
      });
    });

    describe("should respond with status 400", () => {
      it("if has invalid id", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const response = await server.get(`${route}/${faker.random.word}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    });

    describe("should respond with status 404", () => {
      it("if hotel id doesn't exists", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await cleanHotels();
        const response = await server.get(`${route}/1`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
      it("if enrollment doesn't exists", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const response = await server.get(route).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
      it("if ticket doesn't exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get(route).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
    });
  });
});

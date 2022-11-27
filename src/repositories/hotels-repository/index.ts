import { prisma } from "@/config";

async function getHotels() {
  return prisma.hotel.findMany({});
}

async function getHotelsById(id: number) {
  return prisma.hotel.findFirst({
    where: { id },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  getHotels,
  getHotelsById,
};

export default hotelsRepository;

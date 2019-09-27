import { prisma } from "../../../generated/prisma-client";

const resolvers = {
  Query: {
    bookings: async () => await prisma.bookings(),
    booking: async (_, args) => {
      const { id } = args;
      return await prisma.booking({ id: id });
    }
  },
  Booking: {
    async groupId(parent) {
      return await prisma.booking({ id: parent.id }).groupId();
    },
    async categoryId(parent) {
      return await prisma.booking({ id: parent.id }).categoryId();
    },
    async bookingParticipants(parent) {
      return await prisma.booking({ id: parent.id }).bookingParticipants();
    },
    async createUser(parent) {
      return await prisma.booking({ id: parent.id }).createUser();
    }
  }
};

export default resolvers;

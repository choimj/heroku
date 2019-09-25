import { prisma } from "../../../generated/prisma-client";

const resolvers = {
  Query: {
    rooms: async () => await prisma.rooms(),
    room: async (_, args) => {
      const { id } = args;
      const room = await prisma.room({ id: id });
      return room;
    }
  }
};

export default resolvers;

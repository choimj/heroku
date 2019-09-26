import { prisma } from "../../../generated/prisma-client";

const resolvers = {
  Query: {
    rooms: async () => await prisma.rooms(),
    room: async (_, args) => {
      const { id } = args;
      const room = await prisma.room({ id: id });
      return room;
    }
  },
  Mutation: {
    createRoom: async (_, args) => {
      const { name, startTime, endTime, minPerson, location } = args.data;
      return await prisma.createRoom({
        name: name,
        startTime: startTime,
        endTime: endTime,
        minPerson: minPerson,
        location: location
      });
    },
    updateRoom: async (_, args) => {
      const { id, name, startTime, endTime, minPerson, location } = args.data;
      return await prisma.updateRoom({
        where: { id: id },
        data: {
          name: name,
          startTime: startTime,
          endTime: endTime,
          minPerson: minPerson,
          location: location
        }
      });
    },
    deleteRoom: async (_, args) => await prisma.deleteRoom({ id: args.id })
  }
};

export default resolvers;

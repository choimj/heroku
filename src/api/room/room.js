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
      const {
        name,
        startTime,
        endTime,
        minPerson,
        location,
        groupId,
        categoryId,
        userId
      } = args.data;
      return await prisma.createRoom({
        name: name,
        startTime: startTime,
        endTime: endTime,
        minPerson: minPerson,
        location: location,
        groupId: {
          connect: {
            id: groupId
          }
        },
        categoryId: {
          connect: {
            id: categoryId
          }
        },
        createUser: {
          connect: {
            id: userId
          }
        }
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
  },
  Room: {
    async groupId(parent) {
      return await prisma.room({ id: parent.id }).groupId();
    },
    async categoryId(parent) {
      return await prisma.room({ id: parent.id }).categoryId();
    }
  }
};

export default resolvers;

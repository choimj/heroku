import { prisma } from "../../../generated/prisma-client";

const resolvers = {
  Query: {
    bookings: async () => await prisma.bookings(),
    booking: async (_, args) => {
      const { id } = args;
      return await prisma.booking({ id: id });
    },
    filterTest: async (_, args) => {
      console.log(args);
      const { fRoomId, fDate, fStartTime, fEndTime } = args.filter;

      let where = args.filter
        ? {
            AND: [
              fDate ? { date_contains: fDate.contains } : {},
              fRoomId ? { roomId: { id: fRoomId.contains } } : {}
            ],
            OR: [
              {
                AND: [
                  fStartTime ? { startTime_gte: fStartTime.time } : {},
                  fEndTime ? { startTime_lt: fEndTime.time } : {}
                ]
              },
              {
                AND: [
                  fStartTime ? { endTime_gte: fStartTime.time } : {},
                  fEndTime ? { endTime_lt: fEndTime.time } : {}
                ]
              },
              {
                AND: [
                  fStartTime ? { startTime_lte: fStartTime.time } : {},
                  fEndTime ? { endTime_gt: fEndTime.time } : {}
                ]
              },
              {
                AND: [
                  fStartTime ? { startTime_gte: fStartTime.time } : {},
                  fEndTime ? { endTime_lt: fEndTime.time } : {}
                ]
              }
            ]
          }
        : {};

      console.log(where);
      const bookings = await prisma.bookings({
        where
      });

      if (bookings) {
        //throw Error("입력하신 시간대에 이미 예약이 존재합니다.");
      }

      return bookings;
    }
  },
  Mutation: {
    createBooking: async (_, args) => {
      const {
        groupId,
        categoryId,
        roomId,
        date,
        startTime,
        endTime,
        title,
        department,
        name,
        userId
      } = args.data;
      const { fRoomId, fDate, fStartTime, fEndTime } = args.filter;
      let flag = false;

      let where = args.filter
        ? {
            AND: [
              fDate ? { date_contains: fDate.contains } : {},
              fRoomId ? { roomId: { id: fRoomId.contains } } : {}
            ],
            OR: [
              {
                AND: [
                  fStartTime ? { startTime_gte: fStartTime.time } : {},
                  fEndTime ? { startTime_lt: fEndTime.time } : {}
                ]
              },
              {
                AND: [
                  fStartTime ? { endTime_gte: fStartTime.time } : {},
                  fEndTime ? { endTime_lt: fEndTime.time } : {}
                ]
              },
              {
                AND: [
                  fStartTime ? { startTime_lte: fStartTime.time } : {},
                  fEndTime ? { endTime_gt: fEndTime.time } : {}
                ]
              },
              {
                AND: [
                  fStartTime ? { startTime_gte: fStartTime.time } : {},
                  fEndTime ? { endTime_lt: fEndTime.time } : {}
                ]
              }
            ]
          }
        : {};
      const bookings = await prisma.bookings({
        where
      });
      console.log(bookings);
      if (bookings.length > 0) {
        throw Error("입력하신 시간대에 이미 예약이 존재합니다.");
      }

      const booking = await prisma.createBooking({
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
        roomId: {
          connect: {
            id: roomId
          }
        },
        date: date,
        startTime: startTime,
        endTime: endTime,
        title: title,
        department: department,
        name: name,
        createUser: {
          connect: {
            id: userId
          }
        }
      });
      flag = true;
      return { booking: booking, flag: flag };
    },
    createBookingParticipant: async (_, args) => {
      const { bookingId, userId, name } = args.data;
      return await prisma.createBookingParicipant({
        bookingId: {
          connect: {
            id: bookingId
          }
        },
        userId: {
          connect: {
            id: userId
          }
        },
        name: name
      });
    },
    updateBooking: async (_, args) => {
      const {
        id,
        date,
        startTime,
        endTime,
        title,
        department,
        name,
        bookingParticipants
      } = args.data;
      await prisma.deleteManyBookingParicipants({
        AND: [{ bookingId: { id: id } }]
      });
      bookingParticipants.forEach(async element => {
        await prisma.createBookingParicipant({
          bookingId: {
            connect: {
              id: element.bookingId
            }
          },
          userId: {
            connect: {
              id: element.userId
            }
          },
          name: element.name
        });
      });
      return await prisma.updateBooking({
        where: { id: id },
        data: {
          date: date,
          startTime: startTime,
          endTime: endTime,
          title: title,
          department: department,
          name: name
        }
      });
    },
    deleteBooking: async (_, args) =>
      await prisma.deleteBooking({ id: args.id })
  },
  Booking: {
    async groupId(parent) {
      return await prisma.booking({ id: parent.id }).groupId();
    },
    async categoryId(parent) {
      return await prisma.booking({ id: parent.id }).categoryId();
    },
    async roomId(parent) {
      return await prisma.booking({ id: parent.id }).roomId();
    },
    async bookingParticipants(parent) {
      return await prisma.booking({ id: parent.id }).bookingParticipants();
    },
    async createUser(parent) {
      return await prisma.booking({ id: parent.id }).createUser();
    }
  },
  BookingParticipant: {
    async userId(parent) {
      return await prisma.bookingParicipant({ id: parent.id }).userId();
    }
  }
};

export default resolvers;

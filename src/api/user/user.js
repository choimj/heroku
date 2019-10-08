import { prisma } from "../../../generated/prisma-client";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const resolvers = {
  Query: {
    users: async () => await prisma.users(),
    user: async (_, args) => {
      const { id, email } = args;
      return await prisma.user({ id: id, email: email });
    }
  },
  Mutation: {
    createUser: async (_, args) => {
      const { email, name, password } = args;
      const cryptoSecret = process.env.CRYPTO_SECRET;
      const cryptoPassword = crypto
        .createHmac("sha1", cryptoSecret)
        .update(password)
        .digest("base64");
      await prisma.createUser({
        email: email,
        name: name,
        password: cryptoPassword
      });
      return "success";
    },
    comparePassword: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user({
        email: email
      });
      if (user) {
        const compPassword = user.password;
        const cryptoSecret = process.env.CRYPTO_SECRET;
        const cryptoPassword = crypto
          .createHmac("sha1", cryptoSecret)
          .update(password)
          .digest("base64");
        if (cryptoPassword === compPassword) {
          user.flag = true;
          return user;
        } else {
          user.flag = false;
          user.message = "비밀번호가 일치하지 않습니다.";
          return user;
        }
      } else {
        return { flag: false, message: "존재하지 않는 이메일입니다." };
      }
    },
    deleteSession: async (_, args) => {
      const { email, token } = args;
      const session = await prisma.deleteSession({
        email: email,
        token: token
      });

      return session;
    }
  },
  User: {
    async createGroups(parent) {
      return await prisma.user({ id: parent.id }).createGroups();
    },
    async prevBookings(parent) {
      const curDate = new Date();
      const year = curDate.getFullYear();
      const month =
        curDate.getMonth() + 1 < 10
          ? "0" + curDate.getMonth() + 1
          : curDate.getMonth() + 1;
      const date =
        curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
      // console.log(year + "-" + month + "-" + date);

      const prev = await prisma.user({ id: parent.id }).bookings({
        where: {
          AND: [{ date_lt: year + "-" + month + "-" + date }]
        }
      });
      return prev;
    },
    async nextBookings(parent) {
      const curDate = new Date();
      const year = curDate.getFullYear();
      const month =
        curDate.getMonth() + 1 < 10
          ? "0" + curDate.getMonth() + 1
          : curDate.getMonth() + 1;
      const date =
        curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();

      const next = await prisma.user({ id: parent.id }).bookings({
        where: {
          AND: [{ date_gte: year + "-" + month + "-" + date }]
        }
      });
      return next;
    },
    async allBookings(parent) {
      return await prisma.user({ id: parent.id }).bookings({});
    }
  }
};

export default resolvers;

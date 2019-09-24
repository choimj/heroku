import { prisma } from "../../../generated/prisma-client";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const resolvers = {
  Query: {
    categories: async () => await prisma.categories(),
    category: async (_, args) => {
      const { id } = args;
      let category = await prisma.category({ id: id });
      return category;
    }
  },
  Mutation: {
    createCategory: async (_, args) => {
      const { name } = args.date;
      return await prisma.createCategory({ name: name });
    }
  }
};

export default resolvers;

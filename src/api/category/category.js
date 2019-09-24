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
      const { name } = args.data;
      return await prisma.createCategory({ name: name });
    },
    createCategoryParticipant: async (_, args) => {
      const { categoryId, userId, name } = args.data;

      return await prisma.createCategoryParticipant({
        categoryId: {
          connect: {
            id: categoryId
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
    updateCategory: async (_, args) => {
      const { id, name, categoryParticipants } = args.data;
      await prisma.deleteManyCategoryParticipants({
        AND: [{ categoryId: { id: id } }]
      });
      categoryParticipants.forEach(async element => {
        await prisma.createCategoryParticipant({
          categoryId: {
            connect: {
              id: element.categoryId
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

      return await prisma.updateCategory({
        where: { id: id },
        data: {
          name: name
        }
      });
    },
    deleteCategory: async (_, args) =>
      await prisma.deleteCategory({ id: args.data.id })
  },
  Category: {
    async categoryParticipants(parent) {
      return await prisma.category({ id: parent.id }).categoryParticipants();
    }
  },
  CategoryParticipant: {
    async userId(parent) {
      return await prisma.categoryParticipant({ id: parent.id }).userId();
    }
  }
};

export default resolvers;

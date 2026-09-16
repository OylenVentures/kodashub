const { prisma } = require("../utils/connect");

const createUser = async (newData) => {
  try {
    const users = await prisma.user.create({ data: newData });
    return users;
  } catch (error) {
    throw error;
  }
};

const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        hosting: true,
        development: true,
        invoices: true,
      },
    });
    return users;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const users = await prisma.user.findUnique({
      where: { email },
      include: {
        hosting: true,
        development: true,
        invoices: true,
      },
    });
    return users;
  } catch (error) {
    throw error;
  }
};

const updateUserByEmail = async (email, newData) => {
  try {
    const users = await prisma.user.update({
      where: { email },
      data: { ...newData },
    });
    return users;
  } catch (error) {
    throw error;
  }
};

const deleteUserByEmail = async (email) => {
  try {
    const users = await prisma.user.delete({
      where: { email },
    });
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
};

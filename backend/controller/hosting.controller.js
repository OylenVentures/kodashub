const { prisma } = require("../utils/connect");

const createHostingByUser = async (user, newData) => {
  try {
    const hosting = await prisma.hosting.create({
      data: {
        ...newData,
        user: {
          connect: { id: user.id },
        },
      },
    });
    return hosting;
  } catch (error) {
    throw error;
  }
};

const getHostings = async () => {
  try {
    const hosting = await prisma.hosting.findMany();
    return hosting;
  } catch (error) {
    throw error;
  }
};

const getUserHostings = async (email) => {
  try {
    const userHosting = await prisma.user.findUnique({
      where: { email },
      include: {
        hosting: true,
      },
    });
    return userHosting?.hosting;
  } catch (error) {
    throw error;
  }
};

const getHostingById = async (id) => {
  try {
    const hosting = await prisma.hosting.findUnique({
      where: { id },
    });
    return hosting;
  } catch (error) {
    throw error;
  }
};

const updateHostingById = async (id, newData) => {
  try {
    const hosting = await prisma.hosting.update({
      where: { id },
      data: { ...newData },
    });
    return hosting;
  } catch (error) {
    throw error;
  }
};

const deleteHostingById = async (id) => {
  try {
    const hosting = await prisma.hosting.delete({
      where: { id },
    });
    return hosting;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createHostingByUser,
  getHostings,
  getUserHostings,
  getHostingById,
  updateHostingById,
  deleteHostingById,
};

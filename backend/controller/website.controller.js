const { prisma } = require("../utils/connect");

const createWebsiteByUser = async (user, newData) => {
  try {
    const website = await prisma.development.create({
      data: {
        ...newData,
        user: {
          connect: { id: user?.id },
        },
      },
    });
    return website;
  } catch (error) {
    throw error;
  }
};

const getWebsites = async () => {
  try {
    const website = await prisma.development.findMany();
    return website;
  } catch (error) {
    throw error;
  }
};

const getUserWebsites = async (email) => {
  try {
    const userWebsite = await prisma.user.findUnique({
      where: { email },
      include: {
        development: true,
      },
    });
    return userWebsite?.development;
  } catch (error) {
    throw error;
  }
};

const getWebsiteById = async (id) => {
  try {
    const website = await prisma.development.findUnique({
      where: { id },
    });
    return website;
  } catch (error) {
    throw error;
  }
};

const updateWebsiteById = async (id, newData) => {
  try {
    const website = await prisma.development.update({
      where: { id },
      data: { ...newData },
    });
    return website;
  } catch (error) {
    throw error;
  }
};

const deleteWebsiteById = async (id) => {
  try {
    const website = await prisma.development.delete({
      where: { id },
    });
    return website;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createWebsiteByUser,
  getWebsites,
  getUserWebsites,
  getWebsiteById,
  updateWebsiteById,
  deleteWebsiteById,
};

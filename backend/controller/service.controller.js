const { prisma } = require("../utils/connect");

const createService = async (newData) => {
  try {
    const services = await prisma.offerings.create({ data: newData });
    return services;
  } catch (error) {
    throw error;
  }
};

const getServices = async () => {
  try {
    const services = await prisma.offerings.findMany();
    return services;
  } catch (error) {
    throw error;
  }
};

const getServiceById = async (id) => {
  try {
    const services = await prisma.offerings.findUnique({
      where: { id },
    });
    return services;
  } catch (error) {
    throw error;
  }
};

const updateServiceById = async (id, newData) => {
  try {
    const services = await prisma.offerings.update({
      where: { id },
      data: { ...newData },
    });
    return services;
  } catch (error) {
    throw error;
  }
};

const deleteServiceById = async (id) => {
  try {
    const services = await prisma.offerings.delete({
      where: { id },
    });
    return services;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
};

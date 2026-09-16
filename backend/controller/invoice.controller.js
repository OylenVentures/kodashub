const { prisma } = require("../utils/connect");

const createInvoiceByUser = async (user, newData) => {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        ...newData,
        user: {
          connect: { id: user.id },
        },
      },
    });
    return invoice;
  } catch (error) {
    throw error;
  }
};

const getInvoices = async () => {
  try {
    const invoice = await prisma.invoice.findMany();
    return invoice;
  } catch (error) {
    throw error;
  }
};

const getUserInvoices = async (email) => {
  try {
    const userInvoice = await prisma.user.findUnique({
      where: { email },
      include: {
        invoices: true,
      },
    });
    return userInvoice?.invoices;
  } catch (error) {
    throw error;
  }
};

const getInvoiceById = async (id) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });
    return invoice;
  } catch (error) {
    throw error;
  }
};

const updateInvoiceById = async (id, newData) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { ...newData },
    });
    return invoice;
  } catch (error) {
    throw error;
  }
};

const deleteInvoiceById = async (id) => {
  try {
    const invoice = await prisma.invoice.delete({
      where: { id },
    });
    return invoice;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createInvoiceByUser,
  getInvoices,
  getUserInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById,
};

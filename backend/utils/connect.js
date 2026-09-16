const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => {
    console.error("Error connecting to database:", err);
    process.exit(1); // Exit on connection failure
  });

module.exports = { prisma };

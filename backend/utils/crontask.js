const {} = require("nodemailer");
const { prisma } = require("./connect");

async function UpcomingExpiration() {
  // fetch all the hosting services
  // find all the date within the next 28 days and send a mail to both the user and the provider
  const host = await prisma.hosting.findMany();
  const filteredHost = host.find(
    (item) => item.expiration === new Date().toLocaleDateString()
  );
}

async function ExpiredHost() {
  // fetch all the hosting services
  // check if the date is today and send a mail to both the user and the provider
}

async function TerminatedHost() {
  // fetch all the hosting services
  // check if the date is beyound 28 days and send a mail to both the user and the provider
}

module.exports = { UpcomingExpiration, ExpiredHost, TerminatedHost };

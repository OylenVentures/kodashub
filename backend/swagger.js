require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    version: "1.0.0",
    title: "KodasHub API",
    description: "API documentation for the KodasHub application",
  },
  servers: [
    {
      url: process.env.HOST_URI,
      description: "Base url of the server",
    },
  ],
  tags: [],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/*.js"];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./index.js"); // Your project's root file
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: helmet } = require("helmet");
const swaggerAutogen = require("swagger-autogen")();
const swaggerUi = require("swagger-ui-express");
const swaggerdocs = require("./swagger-output.json");

// import routes
const userRoutes = require("./routes/user.route");
const serviceRoutes = require("./routes/service.route");
const hostingRoutes = require("./routes/hosting.route");
const websiteRoutes = require("./routes/website.route");
const invoiceRoutes = require("./routes/invoice.route");
const mailerRoutes = require("./routes/mailer.route");
const checkoutRoutes = require("./routes/checkout.route");
const authRoutes = require("./routes/auth.route");
const passwordResetRoutes = require("./routes/passwordreset.route");

const app = express();

// middleware
const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "https://kodashub.com.ng",
    "https://kodashub.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

// User routes
app.use("/", userRoutes);
app.use("/", serviceRoutes);
app.use("/", hostingRoutes);
app.use("/", websiteRoutes);
app.use("/", invoiceRoutes);
app.use("/", mailerRoutes);
app.use("/", checkoutRoutes);
app.use("/", authRoutes);
app.use("/", passwordResetRoutes);

// Swagger setup
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerdocs, {
    customfavIcon: "https://avatars.githubusercontent.com/u/6936373?s=200&v=4",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
    ],
  })
);

// error route
app.all("*", (req, res) => {
  res.status(404).send("Sorry, the route you are going to does not exist");
});

// connect the server
const port = process.env.PORT;
app.listen(port, async () => {
  console.log("Server is running on port: ", port);
});

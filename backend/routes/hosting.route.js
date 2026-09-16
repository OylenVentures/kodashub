const { Router } = require("express");
const {
  createHostingByUser,
  getHostings,
  getUserHostings,
  getHostingById,
  updateHostingById,
  deleteHostingById,
} = require("../controller/hosting.controller");
const { authenticated, authorized } = require("../utils/middleware");
const { getUserByEmail } = require("../controller/user.controller");

const router = Router();

router.post(
  "/v1/api/hosting/:email",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Hosting']
      #swagger.security = [{"bearerAuth": []}]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Hosting data to be created.',
        required: true,
        schema: {
          name: "string",
          price: "string",
          url: "string",
        }
      }
    */
    try {
      const { name, price, expiration, url } = await req.body;
      const { email } = req.params;
      if (!name || !price || !expiration) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (!email) {
        return res.status(403).json({ error: "Bad request" });
      }

      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const hosting = await createHostingByUser(existingUser, {
        name,
        price,
        expiration,
        url,
      });
      return res
        .status(200)
        .json({ message: "Hosting data saved successfully", hosting });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/v1/api/hosting",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Hosting']
      #swagger.security = [{"bearerAuth": []}]
    */
    try {
      const hosting = await getHostings();
      return res
        .status(200)
        .json({ message: "All hosting received successfully", hosting });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/v1/api/hosting/:slug", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Hosting']
    #swagger.security = [{"bearerAuth": []}]
  */
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(403).json({ message: "Bad request" });
    }

    if (slug.includes("@")) {
      const existingUser = await getUserByEmail(slug);
      if (!existingUser) {
        return res.status(404).json({ message: "User does not exist" });
      }

      const userHosting = await getUserHostings(slug);
      return res
        .status(200)
        .json({ message: "User hostings found", userHosting });
    } else {
      const hosting = await getHostingById(slug);
      if (!hosting) {
        return res.status(404).json({ message: "Hosting not found" });
      }
      return res.status(200).json({ message: "Hosting found", hosting });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/v1/api/hosting/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Hosting']
      #swagger.security = [{"bearerAuth": []}]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Hosting data to be updated.',
        required: false,
        schema: {
          name: "string",
          price: "string",
          url: "string",
          status: "string"
        }
      }
    */
    try {
      const { status, ...body } = await req.body;
      const { id } = req.params;
      if (!id) {
        return res.status(403).json({ message: "Bad request" });
      }

      const existingHosting = await getHostingById(id);
      if (!existingHosting) {
        return res.status(404).json({ message: "Hosting does not exist" });
      }

      await updateHostingById(id, { status: JSON.parse(status), ...body });
      return res
        .status(200)
        .json({ message: "Hosting data updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/v1/api/hosting/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
    #swagger.tags = ['Hosting']
    #swagger.security = [{"bearerAuth": []}]
  */
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(403).json({ message: "Bad request" });
      }

      const existingHosting = await getHostingById(id);
      if (!existingHosting) {
        return res.status(404).json({ message: "Hosting does not exist" });
      }

      await deleteHostingById(id);
      return res.status(200).json({ message: "Hosting deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

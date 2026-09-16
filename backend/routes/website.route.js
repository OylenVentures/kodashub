const { Router } = require("express");
const {
  createWebsiteByUser,
  getWebsites,
  getUserWebsites,
  getWebsiteById,
  updateWebsiteById,
  deleteWebsiteById,
} = require("../controller/website.controller");
const { authenticated, authorized } = require("../utils/middleware");
const { getUserByEmail } = require("../controller/user.controller");

const router = Router();

router.post(
  "/v1/api/website/:email",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Website']
      #swagger.security = [{"bearerAuth": []}]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Website data to be created.',
        required: true,
        schema: {
          name: "string",
          price: "string",
          url: "string",
        }
      }
    */
    try {
      const body = await req.body;
      const { email } = req.params;
      if (!body) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (!email) {
        return res.status(403).json({ error: "Bad request" });
      }

      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const website = await createWebsiteByUser(existingUser, body);
      return res
        .status(200)
        .json({ message: "Website data saved successfully", website });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/v1/api/website",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /* 
    #swagger.tags = ['Website']
    #swagger.security = [{"bearerAuth": []}]
  */
    try {
      const website = await getWebsites();
      return res
        .status(200)
        .json({ message: "All website received successfully", website });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/v1/api/website/:slug", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Website']
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

      const userWebsite = await getUserWebsites(slug);
      return res
        .status(200)
        .json({ message: "User websites found", userWebsite });
    } else {
      const website = await getWebsiteById(slug);
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      return res.status(200).json({ message: "Website found", website });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/v1/api/website/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
    #swagger.tags = ['Website']
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Website data to be updated.',
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

      const existingWebsite = await getWebsiteById(id);
      if (!existingWebsite) {
        return res.status(404).json({ message: "Website does not exist" });
      }

      await updateWebsiteById(id, { status: JSON.parse(status), ...body });
      return res
        .status(200)
        .json({ message: "Website data updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/v1/api/website/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
    #swagger.tags = ['Website']
    #swagger.security = [{"bearerAuth": []}]
  */
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(403).json({ message: "Bad request" });
      }

      const existingWebsite = await getWebsiteById(id);
      if (!existingWebsite) {
        return res.status(404).json({ message: "Website does not exist" });
      }

      await deleteWebsiteById(id);
      return res.status(200).json({ message: "Website deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

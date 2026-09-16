const { Router } = require("express");
const {
  createService,
  getServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
} = require("../controller/service.controller");
const { authenticated, authorized } = require("../utils/middleware");

const router = Router();

router.post(
  "/v1/api/service",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Service']
      #swagger.security = [{"bearerAuth": []}]
    */
    const { plan, description, amount, features } = await req.body;
    try {
      if (!plan || !description || !amount || !features) {
        return res.status(400).json({ message: "All field are required" });
      }
      const service = await createService({
        plan,
        description,
        amount: parseInt(amount),
        features: features?.split(","),
      });
      return res
        .status(200)
        .json({ message: "Service data saved successfully", service });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/v1/api/service", async (req, res) => {
  // #swagger.tags = ['Service']
  try {
    const service = await getServices();
    return res.status(200).json({ message: "All service found", service });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/v1/api/service/:id", async (req, res) => {
  // #swagger.tags = ['Service']
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(403).json({ message: "Bad request" });
    }

    const existingService = await getServiceById(id);
    if (!existingService) {
      return res.status(404).json({ message: "Service does not exist" });
    }

    return res.status(200).json({ message: "Service found", existingService });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/v1/api/service/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Service']
      #swagger.security = [{"bearerAuth": []}]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Service data to be updated.',
        required: false,
        schema: {
          paln: "string",
          amount: 0,
          description: "string",
          features: ["string"]
        }
      }
    */
    try {
      const body = await req.body;
      const { id } = req.params;
      if (!id) {
        return res.status(403).json({ message: "Bad request" });
      }

      const existingService = await getServiceById(id);
      if (!existingService) {
        return res.status(404).json({ message: "Service does not exist" });
      }

      await updateServiceById(id, body);
      return res
        .status(200)
        .json({ message: "Service data updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/v1/api/service/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Service']
      #swagger.security = [{"bearerAuth": []}]
    */
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(403).json({ message: "Bad request" });
      }

      const existingService = await getServiceById(id);
      if (!existingService) {
        return res.status(404).json({ message: "Service does not exist" });
      }

      await deleteServiceById(id);
      return res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

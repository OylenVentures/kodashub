const { Router } = require("express");
const {
  createInvoiceByUser,
  getInvoices,
  getUserInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById,
} = require("../controller/invoice.controller");
const { getUserByEmail } = require("../controller/user.controller");
const { authenticated, authorized } = require("../utils/middleware");

const router = Router();

router.post(
  "/v1/api/invoice/:email",
  authenticated,
  authorized("ADMIN", "USER"),
  async (req, res) => {
    /*
      #swagger.tags = ['Invoice']
      #swagger.security = [{"bearerAuth": []}]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Invoice data to be created.',
        required: true,
        schema: {
          name: "string",
          price: "string",
        }
      }
    */
    try {
      const { name, price } = await req.body;
      const { email } = req.params;
      if (!name || !price) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (!email) {
        return res.status(403).json({ error: "Bad request" });
      }

      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const invoice = await createInvoiceByUser(existingUser, {
        name,
        price: parseInt(price),
      });
      return res
        .status(200)
        .json({ message: "Invoice data saved successfully", invoice });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/v1/api/invoice",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Invoice']
      #swagger.security = [{"bearerAuth": []}]
    */
    try {
      const invoice = await getInvoices();
      return res
        .status(200)
        .json({ message: "All invoice received successfully", invoice });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/v1/api/invoice/:slug", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Invoice']
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

      const userInvoice = await getUserInvoices(slug);
      return res
        .status(200)
        .json({ message: "User invoices found", userInvoice });
    } else {
      const invoice = await getInvoiceById(slug);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      return res.status(200).json({ message: "Invoice found", invoice });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch(
  "/v1/api/invoice/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Invoice']
      #swagger.security = [{"bearerAuth": []}]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Invoice data to be updated.',
        required: false,
        schema: {
          name: "string",
          price: 0,
          status: false
        }
      }
    */
    try {
      const { status, body } = await req.body;
      const { id } = req.params;
      if (!id) {
        return res.status(403).json({ message: "Bad request" });
      }

      const existingInvoice = await getInvoiceById(id);
      if (!existingInvoice) {
        return res.status(404).json({ message: "Invoice does not exist" });
      }

      await updateInvoiceById(id, {
        status: JSON.parse(status),
        ...body,
      });
      return res
        .status(200)
        .json({ message: "Invoice data updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/v1/api/invoice/:id",
  authenticated,
  authorized("ADMIN"),
  async (req, res) => {
    /*
      #swagger.tags = ['Invoice']
      #swagger.security = [{"bearerAuth": []}]
    */
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(403).json({ message: "Bad request" });
      }

      const existingInvoice = await getInvoiceById(id);
      if (!existingInvoice) {
        return res.status(404).json({ message: "Invoice does not exist" });
      }

      await deleteInvoiceById(id);
      return res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;

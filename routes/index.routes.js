const router = require("express").Router();

const passportDataRoute = require("./passport_data.routes");
const categoryRoute = require("./category.routes");
const contractRoute = require("./contract.routes.js");
const clientRoute = require("./client.routes.js");
const adminRoute = require("./admin.routes.js");
const ownerRoute = require("./owner.routes.js");
const statusRoute = require("./status.routes.js");
const attachmentRoute = require("./attachment.routes.js");
const locationRoute = require("./location.routes.js");
const paymentRoute = require("./payment.routes.js");
const techRoute = require("./tech.routes.js");
const reviewRoute = require("./review.routes.js");

router.use("/passportdatas", passportDataRoute);
router.use("/categories", categoryRoute);
router.use("/contracts", contractRoute);
router.use("/admins", adminRoute);
router.use("/payments", paymentRoute);
router.use("/reviews", reviewRoute);
router.use("/locations", locationRoute);
router.use("/statuses", statusRoute);
router.use("/attachments", attachmentRoute);
router.use("/techs", techRoute);
router.use("/owners", ownerRoute);
router.use("/clients", clientRoute);

module.exports = router;

const express = require("express");
const {
  getUser,
  addUser,
  forgotPassword,
  getUserDetails,
  updateUserDetails,
  createOrder,
  getUserOrders,
} = require("../controllers/user");

const {
  getAvailableWorkers,
  getWorkersWhoServesOrder,
} = require("../controllers/workers");

const { getRevenue } = require("../controllers/report");

const { getFAQData, addFaqData, deleteFaqData } = require("../controllers/faq");
const { getAboutUsData, editPageContent } = require("../controllers/pages");
const {
  getOrdersAtDate,
  getTotalOrders,
  getPrices,
  getEventTypes,
  getPackStyles,
} = require("../controllers/orders");

const router = express.Router();

/**7/1/25 */
router.post("/getRevenue", getRevenue);

router.post("/getWorkersForOrder", getWorkersWhoServesOrder);
router.get("/getTotalOrders", getTotalOrders);
router.get("/getEventTypes", getEventTypes);
router.get("/getPrices", getPrices);
router.post("/getOrdersAtDate", getOrdersAtDate);
router.post("/signin", getUser);
router.get("/aboutUsData", getAboutUsData);
router.post("/getAvailableWorkers", getAvailableWorkers);
router.post("/deleteFaq", deleteFaqData);
router.post("/signup", addUser);
router.post("/forgotpassword", forgotPassword);
router.post("/getUserData", getUserDetails);
router.post("/updateUserData", updateUserDetails);
router.post("/createOrder", createOrder);
router.post("/getUserOrders", getUserOrders);
router.get("/faqData", getFAQData);
router.post("/addFaq", addFaqData);
router.post("/editPageContent", editPageContent);
router.get("/getPackStyles", getPackStyles);

module.exports = router;

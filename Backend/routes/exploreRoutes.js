const express = require("express");
const router = express.Router();

const {
  getExploreData,
  searchContent
} = require("../controllers/exploreController");

// Get explore page data (trending + creators)
router.get("/", getExploreData);

// Search posts + users
router.post("/search", searchContent);

module.exports = router;
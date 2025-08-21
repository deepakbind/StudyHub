const express = require("express")
const router = express.Router()

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category")

// Create Category
router.post("/create", createCategory)

// Get All Categories
router.get("/showAll", showAllCategories)

// Get Category Page Details
router.post("/details", categoryPageDetails)

module.exports = router

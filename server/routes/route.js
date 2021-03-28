/**
 * Movie routes
 */

const express = require("express");
const router = express.Router();
const {
    index,
    show,
    store,
    update,
    destroy,
} = require("../controllers/controller");

/* Get all  */
router.get("/", index);

/* Get  */
router.get("/:id", show);

/* Create  */
router.post("/", store);

/* Update  */
router.put("/:id", update);

/* Delete  */
router.delete("/:id", destroy);

module.exports = router;

const express = require("express");
const router = express.Router();

/* GET / */
router.get("/", (req, res) => {
    res.send({ status: "What!!!!" });
});

// router.use("/whiteboard", require("./route"));

module.exports = router;

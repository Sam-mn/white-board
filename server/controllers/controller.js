/**
 *  Controller
 */

const models = require("../models");

/**
 * GET /
 */
const index = async (req, res) => {
    res.status(405).send({
        status: "fail",
        message: "Method Not Implemented.",
    });
};

/**
 * Get
 */
const show = async (req, res) => {
    res.status(405).send({
        status: "fail",
        message: "Method Not Implemented.",
    });
};

/**
 * Create
 */
const store = async (req, res) => {
    res.status(405).send({
        status: "fail",
        message: "Method Not Implemented.",
    });
};

/**
 * Update
 */
const update = async (req, res) => {
    res.status(405).send({
        status: "fail",
        message: "Method Not Implemented.",
    });
};

/**
 * Delete
 */
const destroy = async (req, res) => {
    res.status(405).send({
        status: "fail",
        message: "Method Not Implemented.",
    });
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
};

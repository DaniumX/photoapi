const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateJwtToken = (req, res, next) => {
  // make sure Authorization header exists, otherwise bail
  if (!req.headers.authorization) {
    debug("Authorization header missing");

    return res.status(401).send({
      status: "fail",
      data: "Authorization required",
    });
  }

  const [authSchema, token] = req.headers.authorization.split(" ");
  if (authSchema.toLowerCase() !== "bearer") {
    return res.status(401).send({
      status: "fail",
      data: "Authorization required",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log("Failed to validate");
    return res.status(401).send({
      status: "fail",
      data: "Authorization required",
    });
  }
  next();
};

module.exports = {
  validateJwtToken,
};

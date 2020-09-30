const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });

const { getResponseHeaders } = require("../utils");

const handler = (cb) => async (event) => {
  try {
    const data = await cb(event);
    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log("error", error);

    const {
      name = "Exception",
      statusCode = 500,
      message = "Unknown error",
    } = error;

    return {
      statusCode,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        name,
        message,
        statusCode,
      }),
    };
  }
};

module.exports = handler;

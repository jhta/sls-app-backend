const AWS = require("aws-sdk");
const handler = require("./_handler");
const { getUserId } = require("../utils");

AWS.config.update({ region: "eu-west-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

const lambda = async ({ pathParameters: { timestamp }, headers }) => {
  const params = {
    TableName: tableName,
    Key: {
      user_id: getUserId(headers),
      timestamp: parseInt(timestamp),
    },
  };

  await dynamoDB.delete(params).promise();

  return `note with timestamp: ${timestamp} was removed`;
};

module.exports.handler = handler(lambda);

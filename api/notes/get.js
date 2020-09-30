const AWS = require("aws-sdk");
const handler = require("./_handler");
const { getUserId } = require("../utils");

AWS.config.update({ region: "eu-west-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

const lambda = async ({ queryStringParameters = {}, headers }) => {
  const { limit = 5, start = 0 } = queryStringParameters || {};
  const userId = getUserId(headers);

  const params = {
    TableName: tableName,
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
    Limit: parseInt(limit),
    ScanIndexForward: false,
  };

  if (start) {
    params.ExclusiveStartKey = {
      user_id: userId,
      timestamp: start,
    };
  }

  const data = await dynamoDB.query(params).promise();

  return data;
};

module.exports.handler = handler(lambda);

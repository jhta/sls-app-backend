const AWS = require("aws-sdk");
const handler = require("./_handler");
const { getUserId, getUserName, getExpirationDate } = require("../utils");

AWS.config.update({ region: "eu-west-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

const lambda = async ({ body, headers }) => {
  const { Item = {} } = JSON.parse(body) || {};
  const userId = getUserId(headers);
  const item = {
    ...Item,
    user_id: userId,
    user_name: getUserName(headers),
    expires: getExpirationDate(90),
  };

  await dynamoDB
    .put({
      TableName: tableName,
      Item: item,
      ConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "timestamp",
      },
      ExpressionAttributeValues: {
        ":t": item.timestamp,
      },
    })
    .promise();

  return item;
};

module.exports.handler = handler(lambda);

const AWS = require("aws-sdk");
const handler = require("./_handler");
const { getNoteId } = require("../utils");

AWS.config.update({ region: "eu-west-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

const lambda = async ({ pathParameters }) => {
  const noteId = getNoteId(pathParameters);

  const params = {
    TableName: tableName,
    IndexName: "note_id-index",
    KeyConditionExpression: "note_id = :note_id",
    ExpressionAttributeValues: {
      ":note_id": noteId,
    },
    Limit: 1,
  };

  const { Items: items = [] } = await dynamoDB.query(params).promise();

  if (!items.length)
    throw {
      statusCode: 404,
      name: "Not found",
      message: `Note with note_id ${noteId} not found`,
    };

  return items[0];
};

module.exports.handler = handler(lambda);

const getUserId = (headers = {}) => headers.app_user_id;

const getUserName = (headers = {}) => headers.app_user_name;

const getResponseHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
});

const getIdToken = (headers = {}) => headers.Authorization;

const getExpirationDate = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.getTime();
};

const getNoteId = (pathParameters = {}) =>
  decodeURIComponent(pathParameters.note_id);

module.exports = {
  getResponseHeaders,
  getUserId,
  getUserName,
  getExpirationDate,
  getNoteId,
  getIdToken,
};

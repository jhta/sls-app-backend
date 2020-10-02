const AWS = require("aws-sdk");
const jwtDecode = require("jwt-decode");
const handler = require("./notes/_handler");
const { getIdToken } = require("./utils");

AWS.config.update({ region: "eu-west-1" });

const cognitoIdentity = new AWS.CognitoIdentity();
const identityPoolId = process.env.COGNITO_IDENTITY_POOL_ID;

const getGoogleLogin = (idToken) => ({
  Logins: {
    "accounts.google.com": idToken,
  },
});

const lambda = async ({ headers }) => {
  const idToken = getIdToken(headers);
  const googleLogin = getGoogleLogin(idToken);

  const params = {
    IdentityPoolId: identityPoolId,
    ...googleLogin,
  };

  const { IdentityId } = await cognitoIdentity.getId(params).promise();

  const credentialParams = {
    IdentityId,
    ...googleLogin,
  };

  const decodedUser = jwtDecode(idToken);
  const data = await cognitoIdentity
    .getCredentialsForIdentity(credentialParams)
    .promise();

  return {
    ...data,
    user_name: decodedUser.name,
  };
};

module.exports.handler = handler(lambda);

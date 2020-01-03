exports.creds = {
    identityMetadata: 'https://login.microsoftonline.com/' + process.env.AAD_DIR_ID + '/v2.0/.well-known/openid-configuration',
    clientID: process.env.CLIENT_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.REDIR_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.CLIENT_SECRET,
    validateIssuer: true,
    issuer: 'https://login.microsoftonline.com/' + process.env.AAD_DIR_ID + '/v2.0',
    passReqToCallback: false,
    useCookieInsteadOfSession: false,
    scope: ['profile', 'offline_access'],
    loggingLevel: 'info',
    nonceLifetime: null,
    nonceMaxAmount: 5,
    clockSkew: null,
};

exports.destroySessionUrl = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + process.env.BASE_URL;
exports.useMongoDBSessionStore = true;
exports.databaseUri = process.env.MONGO_SESSION_STORE;
exports.mongoDBSessionMaxAge = 24 * 60 * 60;
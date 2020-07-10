module.exports = {
    // JWT_SECRET will be used to create and verify the JWTs
    JWT_SECRET: '##%%MyS3cr3tK3Y%%##',
    JWT_SESSION: {
      // Since we are using JWTs, we don't need sessions, so we set it to false here. Otherwise, Passport.js will attempt to create a session.
      session: false,
    },
    // Expire tokens after a certain amount of time so users can't stay logged in forever
    JWT_EXPIRES_IN: 24 * 60 * 60,
  };
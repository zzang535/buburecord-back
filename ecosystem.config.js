require("dotenv").config();

module.exports = {
  apps: [
    {
      name: `buburecord-back-${process.env.APP_ENVIRONMENT}`,
      script: "./server.js",
    },
  ],
};

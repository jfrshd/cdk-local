module.exports = async function () {
  const { spawnSync } = require("child_process");
  const dotenv = require("dotenv");
  dotenv.config({ path: __dirname + "/../.env" });

  const NETWORK_NAME = process.env.NETWORK_NAME;
  const DB_CONTAINER_NAME = process.env.DB_CONTAINER_NAME;

  spawnSync(`docker kill ${DB_CONTAINER_NAME}`, {
    shell: true,
  });

  spawnSync(`docker network rm ${NETWORK_NAME}`, {
    shell: true,
  });
};

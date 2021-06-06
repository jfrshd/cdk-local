module.exports = async function () {
  const { spawnSync } = require("child_process");
  const dotenv = require("dotenv");
  dotenv.config({ path: __dirname + "/../../.env" });

  const NETWORK_NAME = process.env.NETWORK_NAME;
  const DB_CONTAINER_NAME = process.env.DB_CONTAINER_NAME;

  // TODO: replace with npm library

  spawnSync(`docker kill ${DB_CONTAINER_NAME}`, {
    shell: true,
  });

  spawnSync(`docker network rm ${NETWORK_NAME}`, {
    shell: true,
  });

  // ? docker network inspect cdk-local-net
  spawnSync(`docker network create --driver bridge ${NETWORK_NAME}`, {
    shell: true,
  });

  spawnSync(
    `docker run --rm -d -p 8000:8000 --name ${DB_CONTAINER_NAME} --network ${NETWORK_NAME} amazon/dynamodb-local`,
    {
      shell: true,
    }
  );

  const AWS = require("aws-sdk");
  const fs = require("fs");

  const dynamodb = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    endpoint: "http://localhost:8000",
    region: "eu-west-1",
    sslEnabled: false,
  });

  async function ls(path) {
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        await ls(path + "/" + dirent.name).catch(console.error);
      } else if (dirent.isFile() && dirent.name === "dynamodb.dev.json") {
        const params = JSON.parse(
          fs.readFileSync(path + "/dynamodb.dev.json", "utf8")
        );
        await dynamodb
          .createTable(params)
          .promise()
          .then((data) => {
            console.log("Created table " + params.TableName);
          })
          .catch((err) => {
            console.error(
              "Unable to create table. Error JSON:",
              JSON.stringify(err, null, 2)
            );
          });
      }
    }
  }

  await ls(__dirname + "/../../lib/models").catch(console.error);
};

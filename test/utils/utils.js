const { spawnSync } = require("child_process");
const dockerLambda = require("docker-lambda");
const lambdaLocal = require("lambda-local");

const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/../../.env" });

async function testNodeLambdaLocally(
  path,
  profileName,
  event = {},
  environment = {},
  showLog = false,
  timeoutMs = 3000,
  testOnPROD = false
) {
  if (testOnPROD === true) {
    environment["PROD"] = "PROD";
  } else {
    environment["TEST"] = "TEST";
  }

  return await lambdaLocal
    .execute({
      event: event,
      lambdaPath: path,
      profileName,
      environment,
      verboseLevel: showLog ? 3 : 0,
      timeoutMs: timeoutMs,
    })
    // .then(function (done) {
    //   console.log(done);
    // })
    .catch(function (err) {
      console.log(err);
    });
}

function testGoLambdaLocally(
  dir,
  event = {},
  environment = {},
  returnLog = false,
  testOnPROD = false
) {
  if (testOnPROD === true) {
    environment["PROD"] = "PROD";
    // environment["AWS_ACCESS_KEY_ID"] = process.env.AWS_ACCESS_KEY_ID;
    // environment["AWS_SECRET_ACCESS_KEY"] = process.env.AWS_SECRET_ACCESS_KEY;
  } else {
    environment["TEST_IN_DOCKER"] = "TEST_IN_DOCKER";
    environment["DB_HOST"] = process.env.DB_CONTAINER_NAME;
  }

  environment["AWS_DEFAULT_REGION"] = "eu-west-1";

  const ENV_VARIABLES = [].concat.apply(
    [],
    Object.keys(environment).map((key) => ["-e", `${key}=${environment[key]}`])
  );

  ENV_VARIABLES.push("--network");
  ENV_VARIABLES.push(process.env.NETWORK_NAME);

  spawnSync(`go build -ldflags="-s -w" -o main`, {
    cwd: dir,
    shell: true,
    env: { ...process.env, GOOS: "linux" },
  });

  return dockerLambda({
    event: event,
    dockerImage: "lambci/lambda:go1.x",
    handler: "main",
    taskDir: dir,
    addEnvVars: true,
    dockerArgs: ENV_VARIABLES,
    // cleanUp: true,
    returnSpawnResult: returnLog,
  });
}

module.exports = { testNodeLambdaLocally, testGoLambdaLocally };

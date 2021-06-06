const path = require("path");
const { testNodeLambdaLocally } = require("./utils/utils");

describe("MyStack", () => {
  test("Currency getAll", async () => {
    expect.assertions(1);

    const jsonPayload = {
      id: "123",
    };

    const res = await testNodeLambdaLocally(
      path.join(__dirname, "../lib/lambdas/nodejs/index.js"),
      "cdktesting",
      jsonPayload,
      {},
      false,
      3000,
      false
    );

    // TODO: fix printing

    expect(res.statusCode).toEqual(200);
  });
});

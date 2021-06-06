const Responses = require("./API_Responses");

test("Responses is an object", () => {
  expect(typeof Responses).toBe("object");
});

test("R_200", () => {
  const res = Responses.R_200({ data: { name: "josh" } });
  expect(res.statusCode).toBe(200);
  expect(typeof res.data).toBe("object");
});

test("R_204", () => {
  const res = Responses.R_204({ data: { name: "josh" } });
  expect(res.statusCode).toBe(204);
  expect(typeof res.data).toBe("object");
});

test("R_400", () => {
  const res = Responses.R_400({ data: { name: "josh" } });
  expect(res.statusCode).toBe(400);
  expect(typeof res.data).toBe("object");
});

test("R_404", () => {
  const res = Responses.R_404({ data: { name: "josh" } });
  expect(res.statusCode).toBe(404);
  expect(typeof res.data).toBe("object");
});

test("Define response", () => {
  const res = Responses.DefineResponse({
    statusCode: 382,
    data: { any: "thing" },
  });
  expect(res.statusCode).toBe(382);
  expect(res.data).toEqual({ any: "thing" });
});

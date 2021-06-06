describe("Testing Student model", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV, TEST: "TEST" }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("Student is an object", () => {
    const Student = require("./Student");
    expect(typeof Student).toBe("object");
  });

  test("Student has get and write", () => {
    const Student = require("./Student");

    expect(typeof Student.getAll).toBe("function");
    expect(typeof Student.get).toBe("function");
    expect(typeof Student.create).toBe("function");
    expect(typeof Student.update).toBe("function");
    expect(typeof Student.delete).toBe("function");
  });

  const data = {
    id: "123", // TODO: FIX
    name: "Josh",
  };

  test("Student create", async () => {
    const Student = require("./Student");
    expect.assertions(1);
    try {
      const res = await Student.create(data.name);
      expect(res).toBe(true);
    } catch (error) {
      console.log("error in Student create test", error);
    }
  });

  test("Student get by id", async () => {
    const Student = require("./Student");
    expect.assertions(1);
    try {
      const res = await Student.get(data.id);
      expect(res.name).toEqual(data.name);
    } catch (error) {
      console.log("error in Student get with ID", error);
    }
  });

  test("Student getAll", async () => {
    const Student = require("./Student");
    expect.assertions(2);
    try {
      const res = await Student.getAll();
      expect(res.Count).toEqual(1);
      expect(res.Items[0].name).toEqual(data.name);
    } catch (error) {
      console.log("error in Student get", error);
    }
  });

  test("Student update", async () => {
    const Student = require("./Student");
    expect.assertions(1);
    try {
      const res = await Student.update(data.id, data.name);
      expect(res).toBe(true);
    } catch (error) {
      console.log("error in Student update test", error);
    }
  });

  test("Student delete", async () => {
    const Student = require("./Student");
    expect.assertions(1);
    try {
      const res = await Student.delete(data.id);
      expect(res).toBe(true);
    } catch (error) {
      console.log("error in Student delete test", error);
    }
  });
});

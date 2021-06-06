const Responses = require("../../models/API_Responses/API_Responses");
const Student = require("../../models/Student/Student");

exports.handler = async (event) => {
  const { id } = event;

  try {
    const result = await Student.get(id);
    return Responses.R_200({ data: result });
  } catch (e) {
    console.log(e);
    return Responses.R_400(e);
  }
};

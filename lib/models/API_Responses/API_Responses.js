const Responses = {
  DefineResponse({ statusCode = 502, message = null, data = null }) {
    return {
      statusCode,
      message,
      data: data,
    };
  },

  R_200({ message = null, data = null }) {
    return this.DefineResponse({ statusCode: 200, message, data });
  },
  R_204({ message = null, data = null }) {
    return this.DefineResponse({ statusCode: 204, message, data });
  },
  R_400({ message = null, data = null }) {
    return this.DefineResponse({ statusCode: 400, message, data });
  },
  R_404({ message = null, data = null }) {
    return this.DefineResponse({ statusCode: 404, message, data });
  },
};

module.exports = Responses;

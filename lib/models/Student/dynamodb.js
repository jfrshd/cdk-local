const camelcaseKeys = require("camelcase-keys");

const studentsTableJSON = camelcaseKeys({
  TableName: "students-cdk",
  KeySchema: [
    {
      AttributeName: "pk",
      KeyType: "HASH",
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: "pk",
      AttributeType: "S",
    },
  ],
  BillingMode: "PAY_PER_REQUEST",
});

module.exports = studentsTableJSON;

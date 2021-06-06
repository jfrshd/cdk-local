const { DynamoDB } = require("aws-sdk");
const { Marshaller } = require("@aws/dynamodb-auto-marshaller");
const marshaller = new Marshaller({ unwrapNumbers: true });
const fs = require("fs");
const uuid4 = require("uuid4");

let options = {};
let STUDENTS_TABLE;

if (process.env.PROD) {
  options = {
    apiVersion: "2012-08-10",
    region: "eu-west-1",
  };
  const tableJSON = require("./dynamodb");
  STUDENTS_TABLE = tableJSON.tableName;
} else if (process.env.DEV || process.env.TEST) {
  options = {
    apiVersion: "2012-08-10",
    endpoint: "http://localhost:8000",
    region: "eu-west-1",
    sslEnabled: false,
  };
  const tableJSON = JSON.parse(
    fs.readFileSync(__dirname + "/dynamodb.dev.json", "utf8")
  );
  STUDENTS_TABLE = tableJSON.TableName;
}

const ddb = new DynamoDB(options);

// ! ========================================================

const Student = {
  async get(id) {
    const params = {
      TableName: STUDENTS_TABLE,
      KeyConditionExpression: "pk = :partitionKey",
      ExpressionAttributeValues: {
        ":partitionKey": { S: id },
      },
    };
    const result = await ddb.query(params).promise();
    if (result.Count === 0) {
      return undefined;
    }
    result.Items = result.Items.map((item) => {
      return marshaller.unmarshallItem(item);
    });
    return result.Items[0];
  },

  async getAll() {
    const params = {
      TableName: STUDENTS_TABLE,
    };
    const result = await ddb.scan(params).promise();
    result.Items = result.Items.map((item) => {
      return marshaller.unmarshallItem(item);
    });

    return result;
  },

  async create(name) {
    if (!name) {
      return "Missing parameters";
    }
    const item = {
      pk: uuid4(),
      name: name,
    };
    const params = {
      TableName: STUDENTS_TABLE,
      Item: marshaller.marshallItem(item),
    };
    await ddb.putItem(params).promise();
    return true;
  },

  async update(id, name) {
    if (!id || !name) {
      return "Missing parameters";
    }
    const items = {
      pk: id,
      name: name,
    };
    const params = {
      TableName: STUDENTS_TABLE,
      Item: marshaller.marshallItem(items),
    };
    await ddb.putItem(params).promise();
    return true;
  },

  async delete(id) {
    const params = {
      Key: {
        pk: {
          S: id,
        },
      },
      TableName: STUDENTS_TABLE,
    };
    await ddb.deleteItem(params).promise();
    return true;
  },
};

module.exports = Student;

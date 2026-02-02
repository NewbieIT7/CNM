const docClient = require("../config/dynamodb");
const { PutCommand, ScanCommand, DeleteCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = process.env.TABLE_NAME;

const Product = {
    getAll: async () => await docClient.send(new ScanCommand({ TableName: TABLE_NAME })),
    getById: async (id) => await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } })),
    create: async (data) => {
        const item = { id: Date.now().toString(), ...data };
        return await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    },
    update: async (id, data) => {
        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "set #n = :n, price = :p, img = :i",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":n": data.name, ":p": data.price, ":i": data.img }
        };
        return await docClient.send(new UpdateCommand(params));
    },
    delete: async (id) => await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }))
};

module.exports = Product;
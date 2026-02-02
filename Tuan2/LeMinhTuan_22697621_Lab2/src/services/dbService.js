const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

const getAllProducts = async () => {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    return response.Items;
};

const saveProduct = async (product) => {
    const command = new PutCommand({ TableName: TABLE_NAME, Item: product });
    return await docClient.send(command);
};

const deleteProduct = async (id) => {
    const command = new DeleteCommand({ TableName: TABLE_NAME, Key: { id: id } });
    return await docClient.send(command);
};

const getProductById = async (id) => {
    const command = new GetCommand({ TableName: TABLE_NAME, Key: { id: id } });
    const response = await docClient.send(command);
    return response.Item;
};

module.exports = { getAllProducts, saveProduct, deleteProduct, getProductById };
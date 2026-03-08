"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDb = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
dotenv_1.default.config();
const client = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1"
});
exports.dynamoDb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    // TODO: May be channelId or 'any'
    if (!event.queryStringParameters?.videoId) {
        return {
            statusCode: '400',
            body: JSON.stringify({"message": "Missing 'videoId'"}),
            headers,
        };
    }

    try {
        switch (event.httpMethod) {
            case 'DELETE':
                await dynamo.update({
                    TableName: "Videos",
                    Key: { videoId: event.queryStringParameters?.videoId },
                    UpdateExpression: "SET blacklisted = :val",
                    ExpressionAttributeValues: {
                        ":val": false
                    },
                }).promise();

                break;
                case 'POST':
                    await dynamo.update({
                        TableName: "Videos",
                        Key: { videoId: event.queryStringParameters?.videoId },
                        UpdateExpression: "SET blacklisted = :val",
                        ExpressionAttributeValues: {
                            ":val": true
                        },
                    }).promise();

                    break;
                    default:
                        throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

const releaseUsage = async (ipAddress) => {
    return dynamo.delete(
            { TableName: 'UsageTimers', Key: { ipAddress: ipAddress} }
            ).promise();
};

exports.handler = async (event, context) => {

    const MAX_VIEW_TIME_MINUTES = 55;
    const UNLOCK_PERIOD_MINUTES = 30;

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    const ipAddress = event.headers['X-Forwarded-For'];

    const dayChanged = (lastUpdate) => {
        const now = new Date().setHours(0,0,0,0);
        const updated = new Date(lastUpdate).setHours(0,0,0,0);

        return now !== updated;
    };

    try {
        let result;
        switch (event.httpMethod) {
            case 'GET':
                result = await dynamo.get({ TableName: 'UsageTimers', Key: { ipAddress: ipAddress} }).promise();
                body = result?.Item;


                if (body) {
                    const now = new Date().getTime();
                    const updated = body.updated;

                    const minutesSinceLastUpdate = Math.round((now - updated)/1000/60);

                    body.exceedsMaxUsage = body.cnt > MAX_VIEW_TIME_MINUTES;
                    body.unlockIn = UNLOCK_PERIOD_MINUTES - minutesSinceLastUpdate;
                    body.remainingUsage = MAX_VIEW_TIME_MINUTES - body.cnt;

                    if (body.exceedsMaxUsage && minutesSinceLastUpdate > UNLOCK_PERIOD_MINUTES) {
                        releaseUsage(ipAddress);

                        body = { message: "Grace period over", exceedsMaxUsage: false, remainingUsage: MAX_VIEW_TIME_MINUTES};
                    }
                    else if (!body.exceedsMaxUsage && dayChanged(updated)) {
                        releaseUsage(ipAddress);
                        body = { message: "Day changed - lock released", exceedsMaxUsage: false, remainingUsage: MAX_VIEW_TIME_MINUTES};
                    }
                }
                else {
                    body = { message: "Not found", exceedsMaxUsage: false, remainingUsage: MAX_VIEW_TIME_MINUTES};

                }
            break;
                case 'PUT':
                    const newItem = await dynamo.update({
                        TableName: "UsageTimers",
                        Key: {
                            ipAddress: ipAddress,
                        },
                        UpdateExpression: "SET cnt = if_not_exists(cnt, :initial) + :count, created = if_not_exists(created, :now), updated = :now",
                        ExpressionAttributeValues: {
                            ":count": 1,
                            ":now": new Date().getTime(),
                            ":initial": 0,
                        },
                        ReturnValues: 'ALL_NEW'
                    }).promise();

                    body = newItem?.Attributes;
                    body.exceedsMaxUsage = body.cnt > MAX_VIEW_TIME_MINUTES;
                    break;
                    default:
                        throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err;
    } finally {
        body.maxViewTime = MAX_VIEW_TIME_MINUTES;
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

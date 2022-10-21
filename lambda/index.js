exports.handler = async (event, context) => {
    let body = {};
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    return {
        statusCode,
        body,
        headers,
    };
};

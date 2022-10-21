const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

class VideoRepository {
    async get(videoId) {
        return dynamo.get({ TableName: 'Videos', Key: { videoId: videoId} })
        .promise()
        .then((result) => result?.Item);
    }

    async list(count = 20) {
        return await dynamo.scan({ TableName: 'Videos', Limit: count})
        .promise()
        .then((result) => result?.Items || []);
    }

    async update(video) {
        return dynamo.update({
            TableName: "Videos",
            Key: {
                videoId: video.videoId,
            },
            UpdateExpression: "SET title = :title, description = :description, thumbnail = :thumbnail, channelId = :channelId, channelTitle = :channelTitle, created = if_not_exists(created, :now), updated = :now",
            ExpressionAttributeValues: {
                ":title": video.title,
                ":description": video.description,
                ":thumbnail": video.thumbnail,
                ":channelId": video.channelId,
                ":channelTitle": video.channelTitle,
                ":now": new Date().getTime()
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        .then((data) => data.Attributes);
    }
}

const isBlacklisted = (str) => {
    if (!str) {
        return false;
    }

    const blacklistKeywords = [ 'diana', 'roma', 'vlad', 'niki' ];

    return blacklistKeywords.some(e => { return str.toLowerCase().split(/\s+/).includes(e.toLocaleLowerCase());});
};

class VideoFilter {
    filter(videos) {
        return videos.filter((video) => {
            if (video.blacklisted) {
                return false;
            }

            const blacklistedChannel = isBlacklisted(video.channelTitle);
            const blacklistedTitle = isBlacklisted(video.title);
            const blacklistedDescription = isBlacklisted(video.description);

            return !(blacklistedChannel ||  blacklistedTitle || blacklistedDescription);
        });
    }
}

module.exports.VideoRepository = VideoRepository;
module.exports.VideoFilter = VideoFilter;
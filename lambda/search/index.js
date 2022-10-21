const YouTubeAPI = require('./youtube.js');
const { VideoRepository, VideoFilter } = require('./video.js');

const youtube = new YouTubeAPI();
const videoRepository = new VideoRepository();
const videoFilter = new VideoFilter();

exports.handler = async (event, context) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        // .../videos/{videoId}
        if (event.pathParameters?.videoId) {
            switch (event.httpMethod) {
                case 'GET':
                    body = await videoRepository.get(event.pathParameters.videoId);
                    if (!body) {
                        statusCode = '404';
                        body = { "message": "Not found" };
                    }
                break;
                    default:
                        throw new Error(`Unsupported method "${event.httpMethod}"`);
            }
        }
        else {
            // .../videos
            switch (event.httpMethod) {
                case 'GET':
                    let videos;
                    try {
                        if (event.queryStringParameters?.mock === 'true') {
                            videos = await videoRepository.list();
                        }
                        else {
                            videos = await youtube.list(event.queryStringParameters?.q || 'kids', event.queryStringParameters?.related);
                        }

                        const results = await Promise.all(videos.map(video => {
                            return videoRepository.update(video);
                        }));

                        body = videoFilter.filter(results).splice(0,event.queryStringParameters?.limit || 6);
                    }
                    catch (e) {
                        // TODO: fallback to dynamo
                    }

                //body = videos;
                break;

                    default:
                        throw new Error(`Unsupported method "${event.httpMethod}"`);
            }
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

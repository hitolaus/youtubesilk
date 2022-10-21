const AWS = require('aws-sdk');
const axios = require('axios');

var sm = new AWS.SecretsManager();

class YouTubeAPI {
    async list(q, related) {
        console.log('youtube.list');

        let params =  {
            key: sm.getSecretValue({SecretId: 'prod/youtubesilk/youtubeapikey'}), // TODO: !!
            part: 'id,snippet',
            type: 'video',
            regionCode: 'RO',
            relevanceLanguage: 'ro',
            safeSearch: 'strict',
            maxResults: 20,
            videoEmbeddable: true, // Can be embedded
            videoSyndicated: true // Can be played outsite youtube.com

        };

        if (q) {
            params.q = q;
        }

        if (related) {
            params.relatedToVideoId = related;
        }

        return axios.get('https://www.googleapis.com/youtube/v3/search', { params: params })
        .then((response) => {
            return response.data?.items.map((video) => {
                return {
                    videoId: video.id?.videoId,
                    title: video.snippet?.title,
                    description: video.snippet?.description,
                    publishedAt: video.snippet?.publishedAt,
                    channelId: video.snippet?.channelId,
                    channelTitle: video.snippet?.channelTitle,
                    thumbnail: video.snippet?.thumbnails?.high?.url
                };
            });
        });
    }
}

module.exports = YouTubeAPI
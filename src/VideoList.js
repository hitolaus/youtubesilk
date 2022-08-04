import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import VideoThumbnail from "./VideoThumbnail";
import './VideoList.css';   
import { useSearchParams } from "react-router-dom";

function VideoList(props) {
    const [ searchParams ] = useSearchParams();
    const [ videos, setVideos ] = useState([]);

    let q = searchParams.get('q') || 'kids';

    useEffect(() => {
        let params =  {
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            part: 'id,snippet',
            type: 'video',
            regionCode: 'RO',
            relevanceLanguage: 'ro',
            safeSearch: 'strict',
            maxResults: 20,
            videoEmbeddable: true, // Can be embedded
            videoSyndicated: true, // Can be played outsite youtube.com
            q: q
        };

    
        if (props.related) {
            params['relatedToVideoId'] = props.related;
        }

        if (process.env.REACT_APP_YOUTUBE_API_MOCK === 'true') {
            axios.get('mock/list.json').then((response) => {
                setVideos(filter(response.data, 6));
            });    

            }
            else {
                axios.get('https://www.googleapis.com/youtube/v3/search', { params: params })
                .then((response) => {
                    setVideos(filter(response.data?.items, 6));
                });
            }
        
            const filter = (items, count) => {
                if (!items) {
                    return items;
                }
                return items
                    .filter((item) => {
                        
                        
                        const blacklistedChannel = isBlacklisted(item.snippet?.channelTitle);
                        const blacklistedTitle = isBlacklisted(item.snippet?.title);
                        const blacklistedDescription = isBlacklisted(item.snippet?.description);
        
                        return !(blacklistedChannel ||  blacklistedTitle || blacklistedDescription); 
                    })
                    .splice(0, count);
            };
            
            const isBlacklisted = (str) => {
                if (!str) {
                    return false;
                }
        
                const blacklistKeywords = [ 'diana', 'roma' ];
        
                return blacklistKeywords.some(e => { return str.toLowerCase().split(/\s+/).includes(e.toLocaleLowerCase());});
            };
    }, [props.related, q]);



    return (
        <div className="videolist">
            {videos.map((video, idx) => {
                return (
                    <VideoThumbnail key={idx} video={video} />
                    )
            })}
        </div>
    );
}

VideoList.propTypes = {
    q: PropTypes.string,
    related: PropTypes.string
};

export default VideoList;
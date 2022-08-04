import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import VideoThumbnail from "./VideoThumbnail";
import './VideoList.css';   
import { useSearchParams } from "react-router-dom";

function VideoList(props) {
    const [ searchParams ] = useSearchParams();
    const [ videos, setVideos ] = useState([]);

    let q = searchParams.get('q') || 'disney';  // TODO

    useEffect(() => {
        let params =  {
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            part: 'id,snippet',
            type: 'video',
            regionCode: 'RO',
            relevanceLanguage: 'ro',
            safeSearch: 'strict',
            maxResults: 6,
            videoEmbeddable: true, // Can be embedded
            videoSyndicated: true, // Can be played outsite youtube.com
            q: q
        };

    
        if (props.related) {
            params['relatedToVideoId'] = props.related;
        }

        if (process.env.REACT_APP_YOUTUBE_API_MOCK === 'true') {
            axios.get('mock/list.json').then((response) => {
                setVideos(response.data);
            });    

            }
            else {
                axios.get('https://www.googleapis.com/youtube/v3/search', { params: params })
                .then((response) => {
                    setVideos(response.data?.items);
                });
            }
        
    }, [props.related, props.q, q]);


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
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
        let params = {};
    
        if (process.env.REACT_APP_YOUTUBE_API_MOCK === 'true') {
            params['mock'] = true;
        }
       
        axios.get('https://api.syscall.dk/youtube/v1/videos', { params: params })
        .then((response) => {
            setVideos(response.data);
        });

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
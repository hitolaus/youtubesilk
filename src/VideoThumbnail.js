import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './VideoThumbnail.css';

function VideoThumbnail(props) {
    return (
        <div className='videothumbnail'>
            <Link to={'/' + props.video.id.videoId}>
                <img src={props.video.snippet?.thumbnails?.high?.url} 
                     alt={props.video.snippet?.title}
                     draggable='false'
                     loading='lazy'
                />
            </Link>
            <div className='videothumbnail--subtitle'>
                {props.video.snippet?.channelTitle}
            </div>
            <div className='videothumbnail--title'>
                {props.video.snippet?.title}
            </div>
        </div>
    );
}

VideoThumbnail.propTypes = {
    video: PropTypes.object.isRequired
};


export default VideoThumbnail;
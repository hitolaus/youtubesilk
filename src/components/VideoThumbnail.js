import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './VideoThumbnail.css';

function VideoThumbnail(props) {
    return (
        <div className='videothumbnail'>
            <Link to={'/' + props.video.videoId}>
                <img src={props.video.thumbnail} 
                     alt={props.video.title}
                     draggable='false'
                     loading='lazy'
                />
            </Link>
            <div className='videothumbnail--subtitle'>
                {props.video.channelTitle}
            </div>
            <div className='videothumbnail--title'>
                {props.video.title}
            </div>
        </div>
    );
}

VideoThumbnail.propTypes = {
    video: PropTypes.object.isRequired
};


export default VideoThumbnail;
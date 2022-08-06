import { useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from "react-youtube";
import VideoList from './VideoList';
import './VideoPlayer.css';

function VideoPlayer() {
    const { videoId } = useParams();
    const [ player, setPlayer ] = useState();

    const options = {
        width: '100%',
        height: '500',
        playerVars: { 
            autoplay: 1,
            controls: 1
        }
    };

    const togglePlay = () => {
        if (player) {
            if (player.getPlayerState() === 1) {
                player.pauseVideo()
            } else {
                player.playVideo();
            }
        }
    };

    return (
        <div className='videoplayer'>
            <div className='videoplayer--player'>
                <div className='videoplayer--player-overlay' onClick={() => togglePlay()}></div>
                <YouTube videoId={videoId}
                    opts={options} 
                    onReady={(e) => setPlayer(e.target)}
                    />
            </div>
            <div className='videoplayer--description'>
                <div className='videoplayer--description-channel'>Foo</div>
                <div className='videoplayer--description-title'>Foo</div>
                <div className='videoplayer--description-description'>Bar</div>
            </div>
            <div className='videoplayer--related-videos'>
                <VideoList related={videoId} />
            </div>
        </div>
    );
}

export default VideoPlayer;
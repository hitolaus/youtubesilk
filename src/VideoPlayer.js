import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from "react-youtube";
import VideoList from './VideoList';
import axios from "axios";
import './VideoPlayer.css';

function VideoPlayer() {
    const { videoId } = useParams();
    const [ player, setPlayer ] = useState();

    useEffect(() => {
        const interval = setInterval(() => {
            if (player && player.getPlayerState() === 1) {
                axios.put('https://api.syscall.dk/youtube/v1/usages')
                    .then((response) => {
                        // TODO: Magic number 5
                        if (response.data?.cnt > 5) {
                            player.pauseVideo();
                        }
                    });
            }
        }, 60000);
        return () => clearInterval(interval);
    });

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
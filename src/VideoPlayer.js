import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from "react-youtube";
import VideoList from './VideoList';
import axios from "axios";
import { MdBlock } from "react-icons/md";
import './VideoPlayer.css';

function VideoPlayer() {
    const { videoId } = useParams();
    const [ player, setPlayer ] = useState();
    const [ video, setVideo ] = useState({});

    useEffect(() => {
        axios.get('https://api.syscall.dk/youtube/v1/videos/' + videoId)
            .then((response) => {
                setVideo(response.data);
            });

    }, [videoId]);

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

    const toggleBlacklistVideo = async () => {
        if (video.blacklisted) {
            return;
        }
        try {
            await axios.post('https://api.syscall.dk/youtube/v1/blacklists?videoId='+videoId)
            setVideo({...video, blacklisted: true});
        }
        catch (e) {
            // TODO: proper handling
            console.log('Error has occured ', e);
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
                <div className='videoplayer--description-channel'>{video.channelTitle}</div>
                <div className='videoplayer--description-title'>{video.title}</div>
                <div className='videoplayer--description-description'>{video.description}</div>
                <div className='videoplayer--description-actions'>
                    <div onClick={() => toggleBlacklistVideo()} className={`videoplayer--description-actions-action ${video.blacklisted ? 'active' : ''}`} ><MdBlock />&nbsp;Video</div>
                </div>
            </div>
            <div className='videoplayer--related-videos'>
                <VideoList related={videoId} />
            </div>
        </div>
    );
}

export default VideoPlayer;
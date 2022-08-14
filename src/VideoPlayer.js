import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from "react-youtube";
import VideoList from './VideoList';
import axios from "axios";
import {MdBlock, MdPlayCircleOutline} from "react-icons/md";
import './VideoPlayer.css';
import './Button.css';

function VideoPlayer() {
    const { videoId } = useParams();
    const [ player, setPlayer ] = useState();
    const [ video, setVideo ] = useState({});
    const [ playing, setPlaying ] = useState(false);

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

    const stateChange = () => {
        setPlaying(player.getPlayerState() === 1);
    };

    const toggleBlacklistVideo = async () => {
        const newState = !video.blacklisted;

        setVideo({...video, blacklisted: newState});
        try {
            if (video.blacklisted) {
                await axios.delete('https://api.syscall.dk/youtube/v1/blacklists?videoId='+videoId)
            }
            else {
                await axios.post('https://api.syscall.dk/youtube/v1/blacklists?videoId='+videoId)
            }
        }
        catch (e) {
            setVideo({...video, blacklisted: !newState});
            alert('Blacklisting failed');
        }
    };

    return (
        <div className='videoplayer'>
            <div className='videoplayer--player'>
                <div className={`videoplayer--player-overlay ${!playing ? 'visible' : ''}`} onClick={() => togglePlay()}>
                    <MdPlayCircleOutline />
                </div>
                <YouTube videoId={videoId}
                        opts={options}
                        onReady={(e) => setPlayer(e.target)}
                         onStateChange={(e) => stateChange()}
                    />
            </div>
            <div className='videoplayer--description'>
                <div className='videoplayer--description-channel'>{video.channelTitle}</div>
                <div className='videoplayer--description-title'>{video.title}</div>
                <div className='videoplayer--description-description'>{video.description}</div>
                <div className='videoplayer--description-actions'>
                    <button onClick={() => toggleBlacklistVideo()} className={`videoplayer--description-actions-action ${video.blacklisted ? 'active' : ''}`} ><MdBlock />&nbsp;{video.blacklisted ? 'Video Blocked' : 'Block Video'}</button>
                </div>
            </div>
            <div className='videoplayer--related-videos'>
                <VideoList related={videoId} />
            </div>
        </div>
    );
}

export default VideoPlayer;
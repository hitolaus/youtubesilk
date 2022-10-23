import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import YouTube from "react-youtube";
import VideoList from '../components/VideoList';
import useWindowDimensions from "../hooks/useWindowDimensions";
import axios from "axios";
import {MdBlock, MdOutlineCancel, MdPlayCircleOutline} from "react-icons/md";
import './VideoPlayer.css';
import '../styles/Button.css';

import { motion } from "framer-motion";

function VideoPlayer() {
    const navigate = useNavigate();

    const { videoId } = useParams();
    const { width } = useWindowDimensions();
    const [ player, setPlayer ] = useState();
    const [ time, setTime ] = useState({current: "00:00", duration: "00:00"});

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
                        if (response.data?.exceedsMaxUsage) {
                            player.pauseVideo();
                        }
                    });
            }

        }, 60000);
        return () => clearInterval(interval);
    });

    const options = {
        width: '100%',
        height: width / 1.77,
        playerVars: {
            autoplay: 1,
            controls: 1
        }
    };

    const togglePlay = () => {
        if (player) {
            updateTime(player);

            if (player.getPlayerState() === 1) {
                player.pauseVideo()
            } else {
                player.playVideo();
            }
        }
    };

    const updateTime = (p) => {
        setTime({
            current: new Date(p.getCurrentTime() * 1000).toISOString().substring(14, 19),
            duration: new Date(p.getDuration() * 1000).toISOString().substring(14, 19)
        });
    };

    const onPlayerReady = (p) => {
        setPlayer(p);
        updateTime(p);
    };

    const onClose = () => {
        navigate(-1);
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
        <motion.div className='videoplayer'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1}}>
            <motion.div className='videoplayer--menu'
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}
                transition={{ duration: 0.3, delay: 2, type: 'spring', damping: 10}}
            >
                <button className='outline icon' onClick={onClose}><MdOutlineCancel /></button>
            </motion.div>
            <div className='videoplayer--player'>
                <div className={`videoplayer--player-overlay ${!playing ? 'visible' : ''}`} onClick={() => togglePlay()}>
                    <MdPlayCircleOutline />
                    <div className="time">
                        {time.current} / {time.duration}
                    </div>
                </div>
                <YouTube videoId={videoId}
                        opts={options}
                        onReady={(e) => onPlayerReady(e.target)}
                        onStateChange={(e) => stateChange()}
                    />
            </div>
            <div className='videoplayer--description'>
                <div className='videoplayer--description-channel'>{video.channelTitle} {"\u2022"} {time.duration}m</div>
                <div className='videoplayer--description-title'>{video.title}</div>
                <div className='videoplayer--description-description'>{video.description}</div>
                <div className='videoplayer--description-actions'>
                    <button onClick={() => toggleBlacklistVideo()} className={`videoplayer--description-actions-action ${video.blacklisted ? 'active' : ''}`} ><MdBlock />&nbsp;{video.blacklisted ? 'Video Blocked' : 'Block Video'}</button>
                </div>
            </div>
            <div className='videoplayer--related-videos'>
                <VideoList related={videoId} />
            </div>
        </motion.div>
    );
}

export default VideoPlayer;
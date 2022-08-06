import axios from "axios";
import { useEffect, useState } from "react";
import { MdLockClock } from "react-icons/md";
import "./UsageTimer.css";

function UsageTimer(props) {
    const [ remainingUsage, setRemainingUsage ] = useState(0);
    const [ exceedsMaxUsage, setExceedsMaxUsage ] = useState(false);
    const [ minutesUntilUnlock, setMinutesUntilUnlock ] = useState(0);

    useEffect(() => {
        const updateUsage = () => {
            axios.get('https://api.syscall.dk/youtube/v1/usages')
                .then((response) => {
                    setRemainingUsage(response.data.remainingUsage ?? 0);
                    setExceedsMaxUsage(response.data.exceedsMaxUsage ?? false);
                    
                    setMinutesUntilUnlock(response.data.unlockIn ?? 0);
                });
        }

        const interval = setInterval(updateUsage, 60000);
        updateUsage();

        return () => clearInterval(interval);
    });


    return (
        <div className={`usagetimer ${exceedsMaxUsage ? 'locked' : ''}`}>
            {exceedsMaxUsage &&    
                <div className="usagetimer--lock-overlay">
                    <div className="usagetimer--lock-overlay-text">
                    Locked for {minutesUntilUnlock} minutes
                    </div>
                </div>
            }
            <div className="usagetimer--timer"><MdLockClock /> {remainingUsage}m</div>
            {props.children}
        </div>
    );
}
export default UsageTimer;
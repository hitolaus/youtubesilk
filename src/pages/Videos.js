import VideoList from "../components/VideoList";
import { motion } from "framer-motion";
import Header from "../Header";

function Videos() {
    return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}>
                <Header/>
                <VideoList />
            </motion.div>
    );
}

export default Videos;
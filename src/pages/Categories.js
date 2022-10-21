import './Categories.css';
import CategoryThumbnail from "../components/CategoryThumbnail";
import { motion } from "framer-motion";

function Categories() {
    return (
        <motion.div className="categorylist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            >
            <CategoryThumbnail  link="/search?q=disneyjr"  title='Disney Jr' thumbnail='/assets/images/logo_disneyjr.png' />
            <CategoryThumbnail  link="/search?q=netflixjr"  title='Netflix Jr' thumbnail='/assets/images/logo_netflixjr.svg' />
            <CategoryThumbnail  link="/search?q=nickjr"  title='Nick Jr' thumbnail='/assets/images/logo_nickjr.svg' />
            <CategoryThumbnail  link="/search?q=nickelodeon"  title='Nickelodeon' thumbnail='/assets/images/logo_nickelodeon.svg' />
            <CategoryThumbnail  link="/search?q=tralala"  title='Tra La La' thumbnail='/assets/images/logo_tralala.png' />
            <CategoryThumbnail  link="/search?q=cantecegradinita"  title='Cantece Gradinita' thumbnail='/assets/images/logo_cantecegradinita.jpeg' />
        </motion.div>
    );
    /*
    <CategoryThumbnail  link="/?"  title='Recent' thumbnail='/assets/images/?.svg' />
    <CategoryThumbnail  link="/?"  title='Most Popular' thumbnail='/assets/images/?.svg' />
     */
}

export default Categories;
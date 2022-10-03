import './CategoryList.css';
import CategoryThumbnail from "./CategoryThumbnail";

function CategoryList() {
    return (
        <div className="categorylist">
            <CategoryThumbnail  link="/search?q=disneyjr"  title='Disney Jr' thumbnail='/assets/images/logo_disneyjr.png' />
            <CategoryThumbnail  link="/search?q=netflixjr"  title='Netflix Jr' thumbnail='/assets/images/logo_netflixjr.svg' />
            <CategoryThumbnail  link="/search?q=nickjr"  title='Nick Jr' thumbnail='/assets/images/logo_nickjr.svg' />
            <CategoryThumbnail  link="/search?q=nickelodeon"  title='Nickelodeon' thumbnail='/assets/images/logo_nickelodeon.svg' />
            <CategoryThumbnail  link="/search?q=tralala"  title='Tra La La' thumbnail='/assets/images/logo_tralala.png' />
            <CategoryThumbnail  link="/search?q=cantecegradinita"  title='Cantece Gradinita' thumbnail='/assets/images/logo_cantecegradinita.jpeg' />
        </div>
    );
    /*
    <CategoryThumbnail  link="/?"  title='Recent' thumbnail='/assets/images/?.svg' />
    <CategoryThumbnail  link="/?"  title='Most Popular' thumbnail='/assets/images/?.svg' />
     */
}

export default CategoryList;
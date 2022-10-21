import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './CategoryThumbnail.css';

function CategoryThumbnail(props) {
    return (
        <div className='categorythumbnail'>
            <div className='categorythumbnail--image'>
            <Link to={props.link}>
                <img src={props.thumbnail}
                     alt={props.title}
                     draggable='false'
                     loading='lazy'
                />
            </Link>
            </div>
            <div className='categorythumbnail--title'>
                {props.title}
            </div>
        </div>
    );
}

CategoryThumbnail.propTypes = {
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
};


export default CategoryThumbnail;
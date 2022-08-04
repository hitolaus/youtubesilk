import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { MdHome, MdSearch } from "react-icons/md";

function Header() {
    const navigate = useNavigate();
    const [ query, setQuery ] = useState();

    async function goHome() {
        navigate("/", { replace: true });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!query) {
            return;
        }
        navigate("/?q="+query, { replace: true });
      }

    return (
        <div className='header'>
            <button onClick={() => goHome()}><MdHome size="2em"/></button>
            <form onSubmit={handleSubmit}>
                <input placeholder='Search' onChange={(e) => setQuery(e.target.value)} />
                <button><MdSearch size="2em"/></button>
            </form>
        </div>
    );   
}


export default Header;
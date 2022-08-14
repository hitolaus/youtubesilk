import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import './Button.css';
import { MdSearch } from "react-icons/md";
import {ReactComponent as Logo } from './logo.svg';

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
            <div className="header--logo" onClick={() => goHome()}><Logo /></div>
            <form onSubmit={handleSubmit}>
                <input placeholder='Search' onChange={(e) => setQuery(e.target.value)} />
                <button><MdSearch size="2em"/></button>
            </form>
        </div>
    );   
}


export default Header;
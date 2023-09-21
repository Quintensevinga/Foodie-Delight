import React, {useState} from 'react';
import {Link} from 'react-router-dom';


function Navbar () {
  const [searchText, setSearchText] = useState('');
  return (
    <nav className="Navbar"> 
      <div className="button-containter">
        <button className="randomRecipe"> Random Recipe</button>
        <button className="favoriteRecipe">My Favorites</button>
      </div>
      <div className="search-container">
        <input 
        className="input-search" 
        type='text'
        placeholder='Enter an ingredient'
        value = {searchText}
        onChange ={(e) => setSearchText(e.target.value)}
        />
        <Link
          to={searchText.trim() !== '' ? `/ingredient/${searchText}` : '/'}
          className="search-button"
        >
          Search
        </Link>
      </div>
    </nav>
  )
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Pages.css';


export const Home = () => {
  const [recentGames, setRecentGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentGames = async () => {
      try {
        const response = await fetch('http://localhost:8088/games');
        const data = await response.json();

        const recentGames = data.filter((game) => {
          const gameDate = new Date(game.dateEntered);
          const cutoffDate = new Date('2019-01-01');
          return gameDate > cutoffDate;
        });

        setRecentGames(recentGames);
      } catch (error) {
        console.error('Error fetching recent games:', error);
      }
    };

    fetchRecentGames();
  }, []);

  useEffect(() => {
    if (searchQuery !== '') {
      setIsSearching(true);
      fetch(`http://localhost:8088/games`)
        .then((response) => response.json())
        .then((data) => {
          const filteredResults = data.filter((game) =>
            game.gameTitle.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filteredResults);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error(error);
          setIsSearching(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  const fetchSearchResults = async () => {
    try {
      const gamesResponse = await fetch('http://localhost:8088/games?_expand=category');
      const gamesData = await gamesResponse.json();
  
      const storesResponse = await fetch('http://localhost:8088/stores');
      const storesData = await storesResponse.json();
  
      const filteredResults = gamesData.filter(
        (game) =>
          game.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.category.categoryName.toLowerCase() === searchQuery.toLowerCase() ||
          game.storeId.some((storeId) =>
            storeId.toString().includes(searchQuery.toLowerCase())
          )
      );
  
      const resultsWithStores = filteredResults.map((game) => {
        const stores = game.storeId.map((storeId) => {
          const store = storesData.find((store) => store.id === storeId);
          return store ? store.storeName : null;
        });
        return {
          gameTitle: game.gameTitle,
          price: game.price,
          category: game.category.categoryName,
          stores: stores.filter((store) => store !== null),
        };
      });
  
      setSearchResults(resultsWithStores);
      setIsSearching(false);
    } catch (error) {
      console.error(error);
      setIsSearching(false);
    }
  };
  



  return (
    <div>
      <div className="search-form">
        <h2>Search</h2>
        <form>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by game title"
          />
        </form>
        {/* Render the search results */}
        {isSearching ? (
          <p>Loading...</p>
        ) : (
          <div>
  {isSearching ? (
  <p>Loading...</p>
  ) : searchResults.length >= 0 ? (
    <div>
      <ul>
      {searchResults.map((game, index) => (
  <li key={index}>
    <b>{game.gameTitle}</b>
    <p>Price: {game.price}</p>
    <p>Category: {game.category}</p>
    <p>Store Location: {game.storeName}</p>
  </li>
))}
</ul>
    </div>
  ) : (
    <p>No Results</p>
  )}
</div>
        )}
      </div>
      
      <div className="slideshow-container">
        <h1 className="new-arrivals-heading">New Arrivals</h1>
        <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false}>
          {recentGames.map((game, index) => (
            <div key={index}>
              <img src={game.imageUrl} alt={game.gameTitle} />
            </div>
          ))}
        </Carousel>
      </div>
      
    </div>
  );
};

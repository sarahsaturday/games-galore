import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Pages.css';

export const Home = () => {
  const [recentGames, setRecentGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

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
        setPageLoaded(true);
      } catch (error) {
        console.error('Error fetching recent games:', error);
      }
    };

    fetchRecentGames();
  }, []);

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
        setPageLoaded(true);
      } catch (error) {
        console.error('Error fetching recent games:', error);
      }
    };

    fetchRecentGames();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsSearching(true);
        const gamesResponse = await fetch('http://localhost:8088/games?_expand=category');
        const gamesData = await gamesResponse.json();
    
        const storesResponse = await fetch('http://localhost:8088/stores');
        const storesData = await storesResponse.json();
    
        const gamesInStoresResponse = await fetch('http://localhost:8088/games_in_stores');
        const gamesInStoresData = await gamesInStoresResponse.json();
    
        const filteredResults = gamesData.filter(
          (game) => game.gameTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const resultsWithStores = filteredResults.map((game) => {
          const gameInStore = gamesInStoresData.find((gis) => gis.gameId === game.id);
          const store = storesData.find((store) => store.id === gameInStore.storeId);
          return {
            gameTitle: game.gameTitle,
            price: game.price,
            category: game.category.categoryName,
            stores: store ? [store.storeName] : [],
          };
        });
    
        setSearchResults(resultsWithStores);
        setIsSearching(false);
      } catch (error) {
        console.error(error);
        setIsSearching(false);
      }
    };

    if (searchQuery !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return <p>Loading...</p>;
    } else if (searchResults && searchResults.length > 0) {
      return (
        <div>
            {searchResults.map((game, index) => (
              <div key={index}>
                <b>{game.gameTitle}</b>
                <p>Price: {game.price}</p>
                <p>Category: {game.category}</p>
                {game.stores.map((store, storeIndex) => (
                  <p key={storeIndex}>Store Location: {store}</p>
                ))}
              </div>
            ))}
        </div>
      );
    }
    // Remove the else block to prevent the "No Results" message from being displayed initially
    return null;
  };

  const renderSlideshow = () => {
    if (!pageLoaded) {
      return null;
    }

    return (
      <Carousel autoPlay interval={3000} infiniteLoop showThumbs={false}>
        {recentGames.map((game, index) => (
          <div key={index}>
            <img src={game.imageUrl} alt={game.gameTitle} />
          </div>
        ))}
      </Carousel>
    );
  };

  return (
    <div>
      <div>
        <h1 className="h1-header">
          <div className="scrolling-text-container">
            <p className="scrolling-text">Search for Games</p>
          </div>
        </h1>
        <div className="search-container">
          <form className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by game title"
            />
          </form>
          {searchResults && searchResults.length > 0 && (
            <div className="search-results">
              {/* Render the search results */}
              {renderSearchResults()}
            </div>
          )}
        </div>
  
        <h1 className="h1-header">New Arrivals</h1>
        <div className="slideshow">
          {renderSlideshow()}
        </div>
      </div>
    </div>
  );
          }  
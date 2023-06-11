import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


export const Home = () => {
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    const fetchRecentGames = async () => {
      try {
        const response = await fetch('http://localhost:8088/games');
        const data = await response.json();
  
        const recentGames = data.filter(game => {
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
  


  return (
    <div>
      <div className="buttons-container">
        <Link to="/games" className="home-button">
          <span className="button-text">GAMES</span>
        </Link>
        <Link to="/stores" className="home-button">
          <span className="button-text">LOCATIONS</span>
        </Link>
        <Link to="/games" className="home-button">
          <span className="button-text">SEARCH</span>
        </Link>
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

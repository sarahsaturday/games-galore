import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';
import { GameForm } from './GameForm';

export const Games = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [editedGame, setEditedGame] = useState(null);
  const [updatedGameTitle, setUpdatedGameTitle] = useState('');
  const [updatedCategoryId, setUpdatedCategoryId] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('gg_user'));
    setUser(storedUser);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('gg_user'));
      setUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8088/games');
        const data = await response.json();

        setGames(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (gameId) => {
    const game = games.find((game) => game.id === gameId);
    setEditedGame(game);
    setUpdatedGameTitle(game.gameTitle);
    setUpdatedCategoryId(game.categoryId);
    setUpdatedPrice(game.price);
    setUpdatedQuantity(game.quantity);
  };

  const handleSave = async (gameId) => {
    const updatedGame = {
      ...editedGame,
      gameTitle: updatedGameTitle,
      categoryId: updatedCategoryId,
      price: parseFloat(updatedPrice),
      quantity: updatedQuantity,
    };

    try {
      await fetch(`http://localhost:8088/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      });

      const updatedGames = games.map((game) => (game.id === gameId ? updatedGame : game));
      setGames(updatedGames);

      setEditedGame(null);

      window.alert('Changes saved!');
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const isEmployee = user?.isStaff;

  return (
    <div>
      {isEmployee && (
        <div>
          <GameForm />
        </div>
      )}
  
      <div className="object-list">
        <h1>Games</h1>
        {games.map(({ id, gameTitle, categoryId, price, imageUrl, quantity }) => {
          return (
            <div key={id} className="object-item">
              <img src={imageUrl} alt={gameTitle} style={{ width: '100px' }} />
              <h2>{gameTitle}</h2>
              <p>Category ID: {categoryId}</p>
              <p>Price: ${price}</p>
              <p>In Stock: {quantity}</p>
  
              {isEmployee && editedGame && editedGame.id === id && (
                <div className="edit-object">
                  <input
                    type="text"
                    id="gameTitle"
                    value={gameTitle}
                    onChange={(e) => setUpdatedGameTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    id="categoryId"
                    value={categoryId}
                    onChange={(e) => setUpdatedCategoryId(e.target.value)}
                  />
                  <input
                    type="text"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setUpdatedQuantity(e.target.value)}
                  />
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setUpdatedPrice(e.target.value)}
                  />
                  <button className="action-button" onClick={() => handleSave(id)}>
                    Save
                  </button>
                  <button className="action-button" onClick={() => setEditedGame(null)}>
                    Cancel
                  </button>
                </div>
              )}
  
              {isEmployee && !editedGame && (
                <div>
                  <button className="action-button" onClick={() => handleEdit(id)}>
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  
};

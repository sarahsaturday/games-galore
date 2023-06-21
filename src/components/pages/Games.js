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
  const [categories, setCategories] = useState([]);
  const [gamesInStores, setGamesInStores] = useState([]);
  const [stores, setStores] = useState([]);
  const [editedGamesInStores, setEditedGamesInStores] = useState(null)
  
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
        console.error('Error fetching games:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8088/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGamesInStores = async () => {
      try {
        const response = await fetch('http://localhost:8088/games_in_stores');
        const data = await response.json();
        setGamesInStores(data);
      } catch (error) {
        console.error('Error fetching games in stores:', error);
      }
    };

    fetchGamesInStores();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:8088/stores');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const handleEdit = (gameId) => {
    const game = games.find((game) => game.id === gameId);
    const gameInStore = gamesInStores.find((gameInStore) => gameInStore.gameId === gameId);
    setEditedGame(game);
    setUpdatedGameTitle(game.gameTitle);
    setUpdatedCategoryId(game.categoryId);
    setUpdatedPrice(game.price);
    setUpdatedQuantity(gameInStore ? gameInStore.quantity : 0);
  };

  const handleSave = async (gameId) => {
    const updatedGame = {
      ...editedGame,
      gameTitle: updatedGameTitle,
      categoryId: updatedCategoryId,
      price: parseFloat(updatedPrice),
      dateEntered: editedGame.dateEntered,
      imageUrl: editedGame.imageUrl
    };

    const updatedGameInStore = {
      ...editedGamesInStores,
      storeId: editedGame.storeId,
      gameId: editedGame.gameId,
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

      await fetch(`http://localhost:8088/games_in_stores/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGameInStore),
      });

      const updatedGames = games.map((game) => (game.id === gameId ? updatedGame : game));
      setGames(updatedGames);

      setEditedGame(null);
      setEditedGamesInStores(null)

      window.alert('Changes saved!');
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  const handleGameTitleChange = (event) => {
    setUpdatedGameTitle(event.target.value);
  };

  const handleDelete = async (gameId) => {
    try {
      // Delete the game from the /games endpoint
      await fetch(`http://localhost:8088/games/${gameId}`, {
        method: 'DELETE',
      });

      // Remove the deleted game from the state
      const updatedGames = games.filter((game) => game.id !== gameId);
      setGames(updatedGames);

      window.alert('Game deleted!');
    } catch (error) {
      console.error('Error deleting game:', error);
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

      <div className="game">
        <h1>Games</h1>
        {games.map(({ id, gameTitle, categoryId, price, imageUrl }) => {
          const category = categories.find((category) => category.id === categoryId);
          const categoryName = category ? category.categoryName : 'Unknown Category';
          const gameInStore = gamesInStores.find((gameInStore) => gameInStore.gameId === id);
          const quantity = gameInStore ? gameInStore.quantity : 0;
          const gameStores = gamesInStores.filter((gameInStore) => gameInStore.gameId === id);

          return (
            <div key={id} className="game">
              <img src={imageUrl} alt={gameTitle} style={{ width: '100px' }} />
              <h2>{gameTitle}</h2>
              <p>Category: {categoryName}</p>
              <p>Price: ${price}</p>
              <p>Available at:</p>
              {gameStores.length === 0 ? (
                <p>Not available in any store</p>
              ) : (
                gameStores.map((gameStore) => {
                  const store = stores.find((store) => store.id === gameStore.storeId);
                  const storeQuantity = gameStore.quantity;

                  if (!store) {
                    return null; // Skip rendering if store is not available yet
                  }

                  return (
                    <p><span key={store.id}>
                      {store.storeName} (In Stock: {storeQuantity})
                    </span>
                    </p>
                  );
                })
              )}


              {isEmployee && editedGame && editedGame.id === id && (
                <div className="edit-object">
                  <input
                    type="text"
                    id="gameTitle"
                    value={updatedGameTitle}
                    onChange={(e) => setUpdatedGameTitle(e.target.value)}
                  />
                  <select
      id="categoryId"
      value={updatedCategoryId}
      onChange={(e) => setUpdatedCategoryId(e.target.value)}
    >
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.categoryName}
        </option>
      ))}
    </select>

                  {/* <input
                    type="text"
                    id="quantity"
                    value={updatedQuantity}
                    onChange={(e) => setUpdatedQuantity(e.target.value)}
                  /> */}
                  <input
                    type="text"
                    id="price"
                    value={updatedPrice}
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
                    View/Edit Details
                  </button>
                </div>
              )}

              {isEmployee && (
                <div>
                  <button className="action-button" onClick={() => handleDelete(id)}>
                    Delete
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

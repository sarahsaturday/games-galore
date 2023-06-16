import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './Pages.css';
import { GameForm } from './GameForm';

export const Games = ({ }) => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [editedGame, setEditedGame] = useState(null);
  const [updatedGameTitle, setUpdatedGameTitle] = useState('');
  const [updatedCategoryId, setUpdatedCategoryId] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedStoreIds, setUpdatedStoreIds] = useState([]);
  const [nextId, setNextId] = useState(0);

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
    // Fetch data from API
    const fetchData = async () => {
      try {
        const gamesResponse = await fetch('http://localhost:8088/games');
        const gamesData = await gamesResponse.json();
        setGames(gamesData);

        const categoriesResponse = await fetch('http://localhost:8088/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const storesResponse = await fetch('http://localhost:8088/stores');
        const storesData = await storesResponse.json();
        setStores(storesData);
      // Calculate the next available id
      const highestId = Math.max(...gamesData.map(game => game.id));
      const nextId = highestId + 1;
      setNextId(nextId);
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

   // Retrieve the storeIds from the game object for the specific game
   setUpdatedStoreIds(game.storeIds);
  };

  const handleStoreCheckboxChange = (e, storeId, gameId) => {
    const isChecked = e.target.checked;
  
    if (isChecked) {
      setUpdatedStoreIds((prevStoreIds) => [...prevStoreIds, storeId]);
    } else {
      setUpdatedStoreIds((prevStoreIds) => prevStoreIds.filter((id) => id !== storeId));
    }
  };  

  const handleSave = async (gameId) => {
    const updatedGame = {
      ...editedGame,
      gameTitle: updatedGameTitle,
      categoryId: updatedCategoryId,
      price: parseFloat(updatedPrice),
      storeIds: updatedStoreIds, // Add the updated storeIds to the game object
    };
  
    try {
      const updatedGames = games.map((game) => {
        if (game.id === gameId) {
          return updatedGame;
        }
        return game;
      });
  
      setEditedGame(updatedGame);
  
      // Send the updated game data to the API
      await fetch(`http://localhost:8088/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      });
  
      // Update the state with the updated data
      setGames(updatedGames);
  
      window.alert('Changes saved!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };
    

  const handleDelete = async (gameId) => {
    try {
      await fetch(`http://localhost:8088/games/${gameId}`, {
        method: 'DELETE',
      });
  
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
      {user?.isStaff && (
        <div>
          <GameForm nextId={nextId} />
        </div>
      )}

      <h1>Games</h1>
    {games.map(({ id, gameTitle, categoryId, price, imageUrl, storeIds }) => {
      const category = categories.find((category) => category.id === categoryId);
      const gameStores = stores
        .filter((store) => storeIds.includes(store.id))
        .map((store) => store.storeName)
        .join(', ');

        return (
          <div key={id}>
            <img src={imageUrl} alt={gameTitle} style={{ width: '100px' }} />
            <h2>{gameTitle}</h2>
            <p>Category: {category ? category.categoryName : ''}</p>
            <p>Price: ${price}</p>
            <p>Available at: {gameStores}</p>

            {isEmployee && editedGame && editedGame.id === id && (
              <div>
                <input
                  type="text"
                  placeholder="Enter game title"
                  value={updatedGameTitle}
                  onChange={(e) => setUpdatedGameTitle(e.target.value)}
                />
                <select
                  value={updatedCategoryId}
                  onChange={(e) => setUpdatedCategoryId(parseInt(e.target.value))}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                <div>
                  <p>Select stores:</p>
                  {stores.map((store) => (
                    <label key={store.id}>
                      <input
                        type="checkbox"
                        value={store.id}
                        checked={updatedStoreIds.includes(store.id)}
                        onChange={(e) => handleStoreCheckboxChange(e, store.id)}
                      />
                      {store.storeName}
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Enter price"
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
                  Edit
                </button>
                <button className="action-button" onClick={() => handleDelete(id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}

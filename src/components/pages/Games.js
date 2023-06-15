import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './Pages.css';

export const Games = ({}) => {
    const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [gamesInStores, setGamesInStores] = useState([]);

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

        const gamesInStoresResponse = await fetch('http://localhost:8088/gamesInStores');
        const gamesInStoresData = await gamesInStoresResponse.json();
        setGamesInStores(gamesInStoresData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  
  const handleEdit = (gameId) => {
    // Handle edit functionality, e.g., redirect to the edit game page
    console.log('Edit game:', gameId);
  };

  const handleSave = (gameId) => {
    // Handle edit functionality, e.g., redirect to the edit game page
    console.log('Edit game:', gameId);
  };

  const handleDelete = (gameId) => {
    // Handle delete functionality, e.g., show confirmation dialog and delete the game
    console.log('Delete game:', gameId);
  };

  const isEmployee = user?.isStaff;

  return (
    <div>
      <h1>Games</h1>
      {games.map((game) => {
        const { id, gameTitle, categoryId, price, imageUrl } = game;
        const category = categories.find((category) => category.id === categoryId);
        const gameStores = gamesInStores
          .filter((gameInStore) => gameInStore.gameId === id)
          .map((gameInStore) => {
            const store = stores.find((store) => store.id === gameInStore.storeId);
            return store ? store.storeName : '';
          })
          .join(', ');

        return (
          <div key={id}>
            <img src={imageUrl} alt={gameTitle} style={{ width: '100px' }} />
            <h2>{gameTitle}</h2>
            <p>Category: {category ? category.categoryName : ''}</p>
            <p>Price: ${price.toFixed(2)}</p>
            <p>Available at: {gameStores}</p>

            {isEmployee && (
              <div>
                <button className="action-button" onClick={() => handleEdit(id)}>
                  Edit
                </button>
                <button className="action-button" onClick={() => handleSave(id)}>
                  Save
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
  );
};
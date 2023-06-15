import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './Pages.css';

export const Games = ({ }) => {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);
    const [gamesInStores, setGamesInStores] = useState([]);
    const [editedGame, setEditedGame] = useState(null);
    const [updatedGameTitle, setUpdatedGameTitle] = useState('');
    const [updatedCategoryId, setUpdatedCategoryId] = useState('');
    const [updatedPrice, setUpdatedPrice] = useState('');
    const [updatedStoreIds, setUpdatedStoreIds] = useState([]);
    const [gameId, setGameId] = useState(null); // Declare the gameId state

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
        const game = games.find((game) => game.id === gameId);
        setEditedGame(game);
        setUpdatedGameTitle(game.gameTitle);
        setUpdatedCategoryId(game.categoryId);
        setUpdatedPrice(game.price);
      
        // Retrieve the storeIds from the gamesInStores array for the specific game
        const storeIds = gamesInStores
          .filter((item) => item.gameId === gameId)
          .map((item) => item.storeId);
      
        setUpdatedStoreIds(storeIds);
      };

      const handleStoreCheckboxChange = (e, storeId) => {
        const isChecked = e.target.checked;
    
        if (isChecked) {
          setUpdatedStoreIds((prevStoreIds) => [...prevStoreIds, storeId]);
        } else {
          setUpdatedStoreIds((prevStoreIds) => prevStoreIds.filter((id) => id !== storeId));
    
          setEditedGame((prevEditedGame) => {
            if (prevEditedGame.id === gameId) {
              const updatedGamesInStores = prevEditedGame.gamesInStores.filter((entry) => entry.storeId !== storeId);
              return {
                ...prevEditedGame,
                gamesInStores: updatedGamesInStores,
              };
            }
            return prevEditedGame;
          });
        }
      };
    
      const handleSave = async (gameId) => {
        const updatedGame = {
          ...editedGame,
          gameTitle: updatedGameTitle,
          categoryId: updatedCategoryId,
          price: updatedPrice,
        };
    
        try {
          const updatedGames = games.map((game) => {
            if (game.id === gameId) {
              return updatedGame;
            }
            return game;
          });
    
          const updatedGamesInStores = gamesInStores.filter((entry) => entry.gameId !== gameId);
    
          const newEntries = updatedStoreIds.map((storeId) => ({
            gameId,
            storeId,
          }));
    
          const updatedGamesInStoresFinal = [...updatedGamesInStores, ...newEntries];
    
          // Update the editedGame object directly
          setEditedGame(updatedGame);
    
          // Send the updated game data to the API
          await fetch(`http://localhost:8088/games/${gameId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGame),
          });
    
          // Delete the existing gamesInStores data for the game from the API
          await fetch(`http://localhost:8088/gamesInStores?gameId=${gameId}`, {
            method: 'DELETE',
          });
    
          // Send the updated gamesInStores data to the API
          await fetch(`http://localhost:8088/gamesInStores`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGamesInStoresFinal),
          });
    
          // Update the state with the updated data
          setGames(updatedGames);
          setGamesInStores(updatedGamesInStoresFinal);
    
          window.alert('Changes saved!');
          window.location.reload();
          localStorage.removeItem('gamesInStores');
        } catch (error) {
          console.error('Error updating game:', error);
        }
      };
    
      const handleDelete = (gameId) => {
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

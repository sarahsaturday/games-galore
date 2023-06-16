import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Pages.css'

export const GameForm = ({ nextId }) => {
    const navigate = useNavigate();
    const [gameTitle, setGameTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [storeIds, setStoreIds] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);
    const [gameAdded, setGameAdded] = useState(false);

  const handleGameTitleChange = (event) => {
    setGameTitle(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleStoreIdsChange = (event) => {
    const storeId = parseInt(event.target.value);
    const isChecked = event.target.checked;
  
    setStoreIds((prevStoreIds) => {
      if (isChecked) {
        return [...prevStoreIds, storeId];
      } else {
        return prevStoreIds.filter((id) => id !== storeId);
      }
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    setIsSubmitting(true);
  
    const newGame = {
      id: nextId,
      gameTitle: gameTitle,
      categoryId: parseInt(categoryId),
      price: parseFloat(price),
      imageUrl: imageUrl,
      storeIds: storeIds,
    };
  
    try {
      const response = await fetch('http://localhost:8088/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGame),
      });
  
      if (response.ok) {
        setIsSubmitting(false);
        navigate('/games');
        // Display the alert and set gameAdded to true
        window.alert('Game added!');
        setGameAdded(true);
      } else {
        throw new Error('Error adding game');
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error adding game:', error);
    }
  };
  

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

    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:8088/stores');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchCategories();
    fetchStores(); if (gameAdded) {
        setGameAdded(false); // Reset gameAdded to false
        window.location.reload(); // Reload the page
      }
    }, [gameAdded]);

  return (
    <div className="games-form">
      <h2>Add New Game</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="gameTitle">Game Title:</label>
          <input
            type="text"
            id="gameTitle"
            className="games-form-input"
            value={gameTitle}
            onChange={handleGameTitleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
      id="category"
      className="games-form-select"
      value={categoryId}
      onChange={handleCategoryChange}
      required
    >
      <option value="">Select Category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.categoryName}
        </option>
      ))}
    </select>
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            className="games-form-input"
            value={price}
            onChange={handlePriceChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            className="games-form-input"
            value={imageUrl}
            onChange={handleImageUrlChange}
            required
          />
        </div>
        <div>
  <label>Stores:</label>
  {stores.map((store) => (
    <div key={store.id}>
      <input
        type="checkbox"
        id={`store-${store.id}`}
        value={store.id}
        checked={storeIds.includes(store.id)}
        onChange={handleStoreIdsChange}
      />
      <label htmlFor={`store-${store.id}`}>{store.storeName}</label>
    </div>
  ))}
</div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="games-form-button"
        >
          Add Game
        </button>
      </form>
    </div>
  );
};

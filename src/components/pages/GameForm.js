import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

export const GameForm = ({ nextId }) => {
  const navigate = useNavigate();
  const [gameTitle, setGameTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

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

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
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
      quantity: parseInt(quantity),
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
        // Display the alert
        window.alert('Game added!');
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

    fetchCategories();
  }, []);

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
            placeholder="Game Title"
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
            placeholder="69.99"
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
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            className="games-form-input"
            placeholder="0"
            value={quantity}
            onChange={handleQuantityChange}
            required
          />
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

import React from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from 'react-bootstrap';

const ItemList = ({ item }) => {
  const dispatch = useDispatch();

  // Update cart handler
  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...item, quantity: 1 },
    });
  };

  return (
    <Card style={{ width: '18rem', marginBottom: '20px' }}>
      <Card.Img variant="top" src={item.image} alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ItemList;
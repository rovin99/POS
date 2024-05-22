import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { Row, Col, Tabs, InputGroup, FormControl,Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ItemList from "../components/ItemList";

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("drinks");
  const [inputValue, setInputValue] = useState('');

  const categories = [
    { name: "drinks" },
    { name: "rice" },
    { name: "noodles" },
  ];
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.rootReducer.cartItems);

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const { data } = await axios.get(`${window.App.url}/api/items`);
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  const addItemToCart = async (itemIdOrName) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get(`${window.App.url}/api/items/${itemIdOrName}`);
      console.log(data);
      if (data && data.name) {
        const confirmed = window.confirm(`Add ${data.name} to cart?`);
        if (confirmed) {
          dispatch({ type: "ADD_TO_CART", payload: data });
        }
      } else {
        alert('Item not found');
      }
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        addItemToCart(inputValue);
        console.log(inputValue);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [inputValue]);

  return (
    <DefaultLayout>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by item name or ID"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </InputGroup>
      <Tabs activeKey={selectedCategory} onSelect={(key) => setSelectedCategory(key)} id="uncontrolled-tab-example">
        {categories.map((category) => (
          <Tab eventKey={category.name} title={category.name}>
            <Row>
              {itemsData
               .filter((i) => i.category === selectedCategory)
               .map((item) => {
                  const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                  const quantityInCart = cartItem? cartItem.quantity : 0;
                  return (
                    <Col xs={12} lg={6} md={6} sm={12} key={item.id}>
                      <ItemList item={item} />
                      <p>Quantity in Cart: {quantityInCart}</p>
                    </Col>
                  );
                })}
            </Row>
          </Tab>
        ))}
      </Tabs>
    </DefaultLayout>
  );
};

export default Homepage;

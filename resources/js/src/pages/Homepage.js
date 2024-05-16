import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { Row, Col, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import ItemList from "../components/ItemList";

const { TabPane } = Tabs;

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("drinks");
  const categories = [
    { name: "drinks" },
    { name: "rice" },
    { name: "noodles" },
  ];
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.rootReducer.cartItems); // Access cart items

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

  return (
    <DefaultLayout>
      <Tabs activeKey={selectedCategory} onChange={(key) => setSelectedCategory(key)}>
        {categories.map((category) => (
          <TabPane tab={category.name} key={category.name}>
            <Row>
              {itemsData
               .filter((i) => i.category === selectedCategory)
               .map((item) => {
                  const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                  const quantityInCart = cartItem? cartItem.quantity : 0; // Determine quantity in cart
                  return (
                    <Col xs={24} lg={6} md={12} sm={6} key={item.id}>
                      <ItemList item={item} />
                      <p>Quantity in Cart: {quantityInCart}</p> {/* Display quantity */}
                    </Col>
                  );
                })}
            </Row>
          </TabPane>
        ))}
      </Tabs>
    </DefaultLayout>
  );
};

export default Homepage;

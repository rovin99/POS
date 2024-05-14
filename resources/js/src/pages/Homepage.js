import React, { useState, useEffect } from "react";
import DefaultLayout from "./../components/DefaultLayout";
import axios from "axios";
import { Row, Col, Tabs } from "antd";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";

const { TabPane } = Tabs;

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("drinks");
  const categories = [
    {
      name: "drinks",
    },
    {
      name: "rice",
    },
    {
      name: "noodles",
    },
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
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
               .map((item) => (
                  <Col xs={24} lg={6} md={12} sm={6} key={item.id}>
                    <ItemList item={item} />
                  </Col>
                ))}
            </Row>
          </TabPane>
        ))}
      </Tabs>
    </DefaultLayout>
  );
};

export default Homepage;

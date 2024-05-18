import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table } from "antd";
import { Input } from "antd";

const CutomerPage = () => {
  const [billsData, setBillsData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(`${window.App.url}/api/bills`);
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllBills();
    //eslint-disable-next-line
  }, []);

  const columns = [
    { title: "ID ", dataIndex: "id" },
    {
      title: "Cutomer Name",
      dataIndex: "customer_name",
    },
    { title: "Contact No", dataIndex: "customer_number" },
  ];
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  return (
    <DefaultLayout>
      <h1>Customer Page</h1>
      <Input.Search
        placeholder="Search by customer name or number"
        value={searchText}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={billsData.filter(
          (bill) =>
            bill.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
            bill.customer_number.toString().includes(searchText)
        )}
        bordered
        pagination={false}
      />
    </DefaultLayout>
  );
};

export default CutomerPage;

import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Table, Form, FormControl } from "react-bootstrap";

const CustomerPage = () => {
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

  useEffect(() => {
    getAllBills();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <DefaultLayout>
      <h1>Customer Page</h1>
      <Form inline className="mb-3">
        <FormControl
          type="text"
          placeholder="Search by customer name or number"
          value={searchText}
          onChange={handleSearch}
          className="mr-sm-2"
        />
      </Form>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Contact No</th>
          </tr>
        </thead>
        <tbody>
          {billsData
           .filter((bill) =>
              bill.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
              bill.customer_number.toString().includes(searchText)
            )
           .map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.customer_name}</td>
                <td>{bill.customer_number}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </DefaultLayout>
  );
};

export default CustomerPage;

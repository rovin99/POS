import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Modal, Button, Table, Form, InputGroup, FormControl, Row, Col } from "react-bootstrap";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(`${window.App.url}/api/items`);
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.delete(`${window.App.url}/api/items`, { params: { itemId: record.id } });
      message.success("Item Deleted Successfully");
      getAllItems();
      setShowModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const itemData = Object.fromEntries(formData.entries());

    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post(`${window.App.url}/api/items`, itemData);
        message.success("Item Added Successfully");
        getAllItems();
        setShowModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.put(`${window.App.url}/api/items`, {
         ...itemData,
          itemId: editItem.id,
        });
        message.success("Item Updated Successfully");
        getAllItems();
        setShowModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  return (
    <DefaultLayout>
      <Row className="justify-content-between mb-3">
        <Col><h1>Item List</h1></Col>
        <Col><Button variant="primary" onClick={() => setShowModal(true)}>Add Item</Button></Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itemsData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td><img src={item.image} alt={item.name} height="60" width="60" /></td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => { setEditItem(item); setShowModal(true); }}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => { setEditItem(null); setShowModal(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editItem!== null? "Edit Item" : "Add New Item"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" defaultValue={editItem?.name} name="name" />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control type="text" placeholder="Enter price" defaultValue={editItem?.price} name="price" />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" placeholder="Enter image URL" defaultValue={editItem?.image} name="image" />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select defaultValue={editItem?.category} name="category">
                <option value="drinks">Drinks</option>
                <option value="rice">Rice</option>
                <option value="noodles">Noodles</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" placeholder="Enter stock" defaultValue={editItem?.stock} name="stock" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setEditItem(null); setShowModal(false); }}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default ItemPage;

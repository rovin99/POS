import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import axios from "axios";
import { Container, Row, Col, Button, Table, Form, FormGroup, Dropdown,Modal } from 'react-bootstrap';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      toast.success("Item Deleted Successfully");
      getAllItems();
      setShowModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      toast.error("Something Went Wrong");
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
        toast.success("Item Added Successfully");
        getAllItems();
        setShowModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        toast.error("Something Went Wrong");
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
        toast.success("Item Updated Successfully");
        getAllItems();
        setShowModal(false);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        toast.error("Something Went Wrong");
        console.log(error);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <DefaultLayout>
        <Container fluid>
          <Row className="justify-content-between align-items-center mb-3">
            <Col><h1 >Item List</h1></Col>
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
              {itemsData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td><img src={item.image} alt={item.name} height="60" width="60" /></td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                          setEditItem(item);
                          setShowModal(true);
                        }}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(item)}>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editItem!== null? "Edit Item" : "Add New Item"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <FormGroup controlId="formBasicText">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" defaultValue={editItem?.name} />
              </FormGroup>
              <FormGroup controlId="formBasicText">
                <Form.Label >Price</Form.Label>
                <Form.Control type="text" name="price" defaultValue={editItem?.price} />
              </FormGroup>
              <FormGroup controlId="formBasicText">
                <Form.Label >Image URL</Form.Label>
                <Form.Control type="text" name="image" defaultValue={editItem?.image} />
              </FormGroup>
              <FormGroup controlId="formBasicSelect">
  <Form.Label >Category</Form.Label>
  <Form.Select name="category" value={editItem? editItem.category : ''} onChange={(e) => setEditItem({...editItem, category: e.target.value})}>
    <option value="drinks">Drinks</option>
    <option value="rice">Rice</option>
    <option value="noodles">Noodles</option>
  </Form.Select>
</FormGroup>
              <FormGroup controlId="formBasicNumber">
                <Form.Label >Stock</Form.Label>
                <Form.Control type="number" name="stock" defaultValue={editItem?.stock} min="1" />
              </FormGroup>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </DefaultLayout>
    </>
  );
};

export default ItemPage;

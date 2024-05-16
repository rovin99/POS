import React, { useState } from 'react';
import {Nav, Card, Form, Button, InputGroup,DropdownButton, Dropdown, FormControl, ListGroup } from 'react-bootstrap';


import { useTranslation } from "react-i18next";

import { BsPerson } from "react-icons/bs"; // Antager at du bruger react-icons for ikoner

const TodoList = ({ filteredCustomers }) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [TaskCreat, setActiveTab] = useState("toDo");
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [image, setImage] = useState(null);

  const filteredOptions = filteredCustomers.filter(customer => {
    return Object.values(customer).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


    const handleSubmit = (e) => {
      e.preventDefault();
      const newTodo = {
        id: todos.length + 1,
        task,
        customer: selectedCustomer.name,
        priority,
        image,
        // username: Cookies.get('username'),
        timestamp: new Date().toISOString(),
      };
      setTodos([...todos, newTodo]);
      setTask('');
      setSelectedCustomer({});
      setPriority('Normal');
      setImage(null);
    };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = { customerId: selectedCustomer, comment: comment, priority: priority };
//     console.log(formData);
//     // Her skal du indsætte din fetch/axios-anmodning for at sende data til din PHP-backend
//     setComment('');
//     setSelectedCustomer(null);
//     setPriority('Normal');
// };

const handleTabSelect = (tab) => {
    setActiveTab(tab);
};



  const handlePriorityIcon = () => {
    switch(priority) {
      case 'Lav': return '🟢'; // Lav prioritet
      case 'Normal': return '🟡'; // Normal prioritet
      case 'Høj': return '🔴'; // Høj prioritet
      default: return '🟡';
    }
  };

    return (
      
      <div className="table-toolkit light">
   <Card.Header className='bg-transparent'>
        <Nav variant="tabs" activeKey={TaskCreat} onSelect={setActiveTab}>
          <Nav.Item>
            <Nav.Link eventKey="toDo">{t('common.toDo')}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Done">{t("common.Finished")}</Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        {TaskCreat === "toDo" && (
          <>
            <Card>
      <Card.Body>
        <ListGroup style={{ overflowY: 'scroll', maxHeight: '200px' }}>
          {todos.map((todo, index) => (
            <ListGroup.Item key={index}>
              Task: {todo.task}, Customer: {todo.customer}, Priority: {todo.priority}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Task"
              aria-label="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <DropdownButton
              as={InputGroup.Prepend}
              variant="outline-secondary"
              title={selectedCustomer.name || "Select Customer"}
              id="input-group-dropdown-1"
            >
              {filteredCustomers.map((customer) => (
                <Dropdown.Item key={customer.id} onClick={() => setSelectedCustomer(customer)}>{customer.name}</Dropdown.Item>
              ))}
            </DropdownButton>
            <Button variant="primary" type="submit">Add</Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
          </>
        )}
      </Card.Body>
      </div>
    );
};
export default TodoList;
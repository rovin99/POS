
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'react-bootstrap';
import { Line, Bar, Pie } from '@ant-design/plots';
import axios from 'axios';
import UnverifiedUsersList from '../components/UnverifiedUsersList';

const AdminDashboard = () => {
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [thisWeekSales, setThisWeekSales] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [numCustomers, setNumCustomers] = useState(0);
  const [outOfStockProducts, setOutOfStockProducts] = useState(0);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const handleApproveUser = (userId) => {
    setUnapprovedUsers(unapprovedUsers.filter(user => user.user_id!== userId));
  };

    useEffect(() => {
    axios.get('/api/bills/monthly-sales')
    .then(response => {
        
        setMonthlySales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/monthly-profit')
    .then(response => {
        
        setMonthlyProfit(response.data);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/items/most-sold')
    .then(response => {
       
        setMostSoldProducts(response.data);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/this-month-sales')
    .then(response => {
       
        setThisMonthSales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/this-week-sales')
    .then(response => {
        
        setThisWeekSales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/today-sales')
    .then(response => {
       
        setTodaySales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });
      axios.get('/api/customers/count')
      .then(response => {
         setNumCustomers(response.data.count);
       })
      .catch(error => {
         console.error(error);
       });
 
     axios.get('/api/items/out-of-stock')
      .then(response => {
         setOutOfStockProducts(response.data.count);
       })
      .catch(error => {
         console.error(error);
       });
       axios.get('/api/users/unverified')
    .then(response => {
      setUnapprovedUsers(response.data.unverified_users);
    })
    .catch(error => {
      console.error(error);
    });

  }, []);

  return (
    <Row className="justify-content-md-center">
      <Col md={4}>
        <Card>
          <CardTitle>Monthly Sales</CardTitle>
          <CardBody>
            <Line
              data={[
                { month: 'Jan', sales: 1000 },
                { month: 'Feb', sales: 1200 },
                { month: 'Mar', sales: 1100 },
                { month: 'Apr', sales: 1300 },
                { month: 'May', sales: 1400 },
              ]}
              xField="month"
              yField="sales"
              seriesField="sales"
            />
            <h5>Monthly Sales: {monthlySales}</h5>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>Monthly Profit</CardTitle>
          <CardBody>
            <Bar
              data={[
                { month: 'Jan', profit: 200 },
                { month: 'Feb', profit: 250 },
                { month: 'Mar', profit: 220 },
                { month: 'Apr', profit: 280 },
                { month: 'May', profit: 300 },
              ]}
              xField="month"
              yField="profit"
              seriesField="profit"
            />
            <h5>Monthly Profit: {monthlyProfit}</h5>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>Most Sold Products</CardTitle>
          <CardBody>
            <Pie
              data={mostSoldProducts.map(item => ({ name: item.name, value: item.sales }))}
              angleField="value"
              colorField="name"
            />
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>This Month Sales</CardTitle>
          <CardBody>
            <h5> {thisMonthSales}</h5>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>This Week Sales</CardTitle>
          <CardBody>
            <h5> {thisWeekSales}</h5>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>Today Sales</CardTitle>
          <CardBody>
            <h5> {todaySales}</h5>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>Number of Customers</CardTitle>
          <CardBody>
            <h5>{numCustomers}</h5>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>Out of Stock Products</CardTitle>
          <CardBody>
            <h5>{outOfStockProducts}</h5>
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardTitle>Unverified Users</CardTitle>
          <CardBody>
             <UnverifiedUsersList users={unapprovedUsers} onApprove={handleApproveUser} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import { Row, Col, Card, Statistic } from 'antd';
// import { Line, Bar, Pie } from '@ant-design/plots';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [monthlySales, setMonthlySales] = useState(0);
//   const [monthlyProfit, setMonthlyProfit] = useState(0);
//   const [mostSoldProducts, setMostSoldProducts] = useState([]);
//   const [thisMonthSales, setThisMonthSales] = useState(0);
//   const [thisWeekSales, setThisWeekSales] = useState(0);
//   const [todaySales, setTodaySales] = useState(0);

//   useEffect(() => {
//     axios.get('/api/bills/monthly-sales')
//      .then(response => {
        
//         setMonthlySales(response.data.json());
//       })
//      .catch(error => {
//         console.error(error);
//       });

//     axios.get('/api/bills/monthly-profit')
//      .then(response => {
//         setMonthlyProfit(response.data.json());
//       })
//      .catch(error => {
//         console.error(error);
//       });

//     axios.get('/api/items/most-sold')
//      .then(response => {
//         setMostSoldProducts(response.data.json());
//       })
//      .catch(error => {
//         console.error(error);
//       });

//     axios.get('/api/bills/this-month-sales')
//      .then(response => {
//         setThisMonthSales(response.data.json());
//       })
//      .catch(error => {
//         console.error(error);
//       });

//     axios.get('/api/bills/this-week-sales')
//      .then(response => {
//         setThisWeekSales(response.data.json());
//       })
//      .catch(error => {
//         console.error(error);
//       });

//     axios.get('/api/bills/today-sales')
//      .then(response => {
//         setTodaySales(response.data.json());
//       })
//      .catch(error => {
//         console.error(error);
//       });
//   }, []);

//   return (
//     <Row gutter={16}>
//       <Col span={8}>
//         <Card title="Monthly Sales">
//           <Line
//             data={[
//               { month: 'Jan', sales: 1000 },
//               { month: 'Feb', sales: 1200 },
//               { month: 'Mar', sales: 1100 },
//               { month: 'Apr', sales: 1300 },
//               { month: 'May', sales: 1400 },
//             ]}
//             xField="month"
//             yField="sales"
//             seriesField="sales"
//           />
//           <Statistic title="Monthly Sales" value={monthlySales} />
//         </Card>
//       </Col>
//       <Col span={8}>
//         <Card title="Monthly Profit">
//           <Bar
           
//             data={[
//               { month: 'Jan', profit: 200 },
//               { month: 'Feb', profit: 250 },
//               { month: 'Mar', profit: 220 },
//               { month: 'Apr', profit: 280 },
//               { month: 'May', profit: 300 },
//             ]}
//             xField="month"
//             yField="profit"
//             seriesField="profit"
//           />
//           <Statistic title="Monthly Profit" value={monthlyProfit} />
//         </Card>
//       </Col>
//       <Col span={8}>
//         <Card title="Most Sold Products">
//           <Pie
            
//             data={mostSoldProducts.map(item => ({ name: item.name, value: item.sales }))}
//             angleField="value"
//             colorField="name"
//           />
//         </Card>
//       </Col>
//       <Col span={8}>
//         <Card title="This Month Sales">
//           <Statistic title="This Month Sales" value={thisMonthSales} />
//         </Card>
//       </Col>
//       <Col span={8}>
//         <Card title="This Week Sales">
//           <Statistic title="This Week Sales" value={thisWeekSales} />
//         </Card>
//       </Col>
//       <Col span={8}>
//         <Card title="Today Sales">
//           <Statistic title="Today Sales" value={todaySales} />
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Line, Bar, Pie } from '@ant-design/plots';
import axios from 'axios';

const AdminDashboard = () => {
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [mostSoldProducts, setMostSoldProducts] = useState([]);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [thisWeekSales, setThisWeekSales] = useState(0);
  const [todaySales, setTodaySales] = useState(0);

  useEffect(() => {
    axios.get('/api/bills/monthly-sales')
    .then(response => {
        // Removed.json() as Axios handles this automatically
        setMonthlySales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/monthly-profit')
    .then(response => {
        // Removed.json()
        setMonthlyProfit(response.data);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/items/most-sold')
    .then(response => {
        // Removed.json()
        setMostSoldProducts(response.data);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/this-month-sales')
    .then(response => {
        // Removed.json()
        setThisMonthSales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/this-week-sales')
    .then(response => {
        // Removed.json()
        setThisWeekSales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });

    axios.get('/api/bills/today-sales')
    .then(response => {
        // Removed.json()
        setTodaySales(response.data.sales);
      })
    .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Monthly Sales">
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
          <Statistic title="Monthly Sales" value={monthlySales} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Monthly Profit">
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
          <Statistic title="Monthly Profit" value={monthlyProfit} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Most Sold Products">
          <Pie
            data={mostSoldProducts.map(item => ({ name: item.name, value: item.sales }))}
            angleField="value"
            colorField="name"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="This Month Sales">
          <Statistic title="This Month Sales" value={thisMonthSales} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="This Week Sales">
          <Statistic title="This Week Sales" value={thisWeekSales} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Today Sales">
          <Statistic title="Today Sales" value={todaySales} />
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboard;

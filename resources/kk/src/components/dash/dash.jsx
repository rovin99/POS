import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap"; // Antager du bruger React Bootstrap
import APIConfig from "../config";
import { formatToUrduNumeric } from "../../locales/format"; // Ændre stien til hvor du har gemt filen

function AkkuSum() {
  const [summaryS, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${window.App.url}/akku-summary`, {
        withCredentials: true,
      })
      .then((response) => {
        setData(response.data.summary || []);
        console.log(response.data.summary); // Make sure 'response' is defined here as the parameter
      })
      .catch((error) => {
        console.error("Could not fetch customer data:", error);
      });
  }, []);

  const isNewMonth = (currentItem, index) => {
    // If it's the first item, there's no previous item to compare, so we return false.
    if (index === 0) return false;
    // Compare with previous item's month.
    return currentItem.logMonth !== summaryS[index - 1].logMonth;
  };

  return (
    <div>
      <h6>Monthly accumulated balance</h6>
      <div className="table-responsive small">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Month</th>
              <th>User Type</th>
              <th>Transaction Count</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {summaryS.map((item, index) => (
              <tr
                key={index}
                style={
                  isNewMonth(item, index)
                    ? { borderBottom: "3px solid black" }
                    : null
                }>
                <td>{item.logMonth}</td>
                <td>{item.UserType}</td>
                <td>{item.TransactionCount}</td>
                <td>{formatToUrduNumeric(item.TotalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default AkkuSum;

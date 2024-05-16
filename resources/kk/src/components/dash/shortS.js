import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWallet } from '@fortawesome/free-solid-svg-icons';
import { formatToUrduNumeric } from "../../locales/format";

function CustomerStatistics({ customers }) {
  const totalCustomers = customers.length;
  const totalBalance = customers.reduce((total, customer) => total + parseFloat(customer.balance), 0);

  return (
    <ButtonGroup>
      <Button variant="light" disabled>
        <FontAwesomeIcon icon={faUsers} /> {totalCustomers}
      </Button>
      <Button variant="light" disabled style={{
                                color: totalBalance >= 0 ? "red" : "blue",
                              }}>
        <FontAwesomeIcon icon={faWallet} /> {formatToUrduNumeric(totalBalance)}
      </Button>
    </ButtonGroup>
  );
}
export default CustomerStatistics;

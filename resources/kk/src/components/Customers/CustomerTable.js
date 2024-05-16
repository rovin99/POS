import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Table,
  Modal,
  Button,
  Form,
  FormControl,
  Nav,
  Badge,
  Dropdown,
  Row,
  Col,
  Container,
  ButtonGroup,
} from "react-bootstrap";
import {} from "react-bootstrap";
import AddTransactionForm from "../AddTransactionForm";
import CreateUserModal from "../CreateUserModal";
import TransactionsTable from "../transTable/UserTrans";
import EditUserModal from "./EditUserModal";
import moment from "moment";
import TransactionsTap from "../trans/TransTap";
import { useTranslation } from "react-i18next"; // Importer useTranslation-krogen
import APIConfig from "../config";
import DateFilterDropdown from "../hooks/DateFilterDropdown";
import CustomerStatistics from '../dash/shortS';

import { formatToUrduNumeric } from "../format"; // Ændre stien til hvor du har gemt filen

function UsersTable() {
  const { t } = useTranslation(); // Brug useTranslation-krogen
  const [selectedPeriod, setSelectedPeriod] = useState("30d"); // Startperiode
  const [sortField, setSortField] = useState("lastTransactionDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [userType, setUserType] = useState("client");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const handleSort = (newSortField) => {
    if (newSortField === sortField) {
      // Skift sortingsretning for samme felt
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(newSortField);
      setSortOrder("asc");
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const matchesSearchTerm =
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phoneNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.companyName.toLowerCase().includes(searchTerm.toLowerCase());

        const isBlacklisted =
          statusFilter === "blacklisted"
            ? customer.blackListed === "1" || customer.blackListed === true
            : true;
        const isWatched =
          statusFilter === "watch"
            ? customer.watch === "1" || customer.watch === true
            : true;

        return matchesSearchTerm && isBlacklisted && isWatched;
      })
      .sort((a, b) => {
        let valA, valB;
        if (sortField === "balance" || sortField === "transactionCount") {
          // Antager at 'balance' og 'transactionCount' er numeriske
          valA = parseFloat(a[sortField]);
          valB = parseFloat(b[sortField]);
        } else if (sortField === "lastTransactionDate") {
          // Dato sammenligning
          valA = new Date(a[sortField]);
          valB = new Date(b[sortField]);
        } else {
          // String sammenligning (f.eks. 'name', 'companyName')
          valA = a[sortField]?.toLowerCase(); // Brug valgfri kædning for at undgå fejl med undefined værdier
          valB = b[sortField]?.toLowerCase();
        }

        if (valA < valB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0; // Ingen ændring i rækkefølgen hvis værdierne er ens
      });
  }, [customers, searchTerm, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    axios
      .get(`${window.App.url}/fetch-client-users`, {
        withCredentials: true,
      })
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Could not fetch customer data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${window.App.url}/transactions/userType/client`, {
        withCredentials: true,
      })
      .then((response) => {
        // Antag, du gør noget med response.data her
      })
      .catch((error) => {
        console.error("Could not fetch transactions for all users:", error);
      });
  }, []);

  const fetchTransactions = (userId, period) => {
    console.log(
      `Requesting transactions for period: ${period}, for user: ${userId}`
    );
    const { startDate, endDate } = period;
    const endpoint = `${window.App.url}/transactions/user/${userId}/period?startDate=${startDate}&endDate=${endDate}`;
    return axios.get(endpoint, { withCredentials: true });
  };

  const handleUserClick = (userId) => {
    fetchTransactions(userId, selectedPeriod)
      .then((response) => {
        setTransactions(response.data);
        const user = customers.find((user) => user.id === userId);
        setSelectedUser(user);
        setShowModal(true);
        console.log("Received transaction data:", response.data); // Log efter data er modtaget
      })
      .catch((error) => {
        console.error("Could not fetch transactions:", error);
      });
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (selectedUser) {
      fetchTransactions(selectedUser.id, newPeriod)
        .then((response) => {
          if (response && response.data) {
            setTransactions(response.data);
            setShowModal(true);
            console.log("Received transaction data:", response.data); // Log efter data er modtaget
          } else {
            console.error("Invalid response received:", response);
            // Vis en fejlmeddelelse til brugeren
          }
        })
        .catch((error) => {
          console.error("Could not fetch transactions:", error);
          // Vis en fejlmeddelelse til brugeren eller foretag yderligere fejlhåndtering
        });
    }
  };

  const handleCloseAddTransactionModal = () => {
    setShowAddTransactionModal(false);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateUserClick = (selectedUserType) => {
    setSelectedUser(null);
    setShowModal(false);
    setShowCreateUserModal(true);
    setUserType(selectedUserType);
  };
  const sortedAndFilteredCustomers = React.useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let valA, valB;

      if (sortField === "balance" || sortField === "transactionCount") {
        valA = parseFloat(a[sortField]);
        valB = parseFloat(b[sortField]);
      } else if (sortField === "lastTransactionDate") {
        valA = new Date(a[sortField]);
        valB = new Date(b[sortField]);
      } else {
        valA = a[sortField]?.toLowerCase();
        valB = b[sortField]?.toLowerCase();
      }

      if (valA < valB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredCustomers, sortField, sortOrder]);
  const handleEditUserClick = (customer) => {
    setSelectedCustomerId(customer);
    setShowEditModal(true);
  };

  return (
    <>
    <Container fluid>
      <div className="m-2">
        <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabSelect}>
          <Nav.Item>
            <Nav.Link eventKey="customers">{t("common.customers")}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="NewEntries">{t("common.newEntries")}</Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === "customers" && (
          <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
         
              <CustomerStatistics customers={customers} />

              <Form className="col-6">
                <FormControl
                  type="search"
                  placeholder={t("common.searchPlaceholder")}
                  className=""
                  aria-label="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form>
              <div className="btn-toolbar mb-2 mb-md-0">
                <ButtonGroup>
                  {/* Dropdown knap */}
                  <Dropdown as={ButtonGroup}>
                    <Button variant="success">
                      {" "}
                      {t("common.filter")}: {t(statusFilter)}
                    </Button>
                    <Dropdown.Toggle
                      split
                      variant="success"
                      id="dropdown-split-basic"
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setStatusFilter("all")}>
                        {t("common.all")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setStatusFilter("blacklisted")}>
                        {t("common.blacklisted")}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("watch")}>
                        {t("common.watch")}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    variant="primary"
                    onClick={() => handleCreateUserClick("client")}>
                    {t("common.addNewCustomer")}
                  </Button>
                </ButtonGroup>
              </div>
            </div>


                {/* <Table striped bordered hover size="md"> */}
                <Table striped bordered responsive="xl">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("id")}>{t("table.id")}</th>
                      <th onClick={() => handleSort("name")}>
                        {t("table.name")}
                      </th>
                      <th onClick={() => handleSort("companyName")}>
                        {t("table.companyName")}
                      </th>
                      <th onClick={() => handleSort("phoneNumber")}>
                        {t("table.phoneNumber")}
                      </th>
                      <th onClick={() => handleSort("address")}>
                        {t("table.address")}
                      </th>
                      <th onClick={() => handleSort("transactionCount")}>
                        {t("table.entries")}
                      </th>
                      <th onClick={() => handleSort("balance")}>
                        {t("table.balance")}
                      </th>
                      <th>{t("table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndFilteredCustomers.map((customer, index) => {
                      let lastTransactionTime = "No Transactions";
                      if (customer.lastTransactionDate) {
                        const duration = moment.duration(
                          moment().diff(moment(customer.lastTransactionDate))
                        );
                        const days = duration.days();
                        const hours = duration.hours();
                        const minutes = duration.minutes();
                        lastTransactionTime = `${days} days, ${hours} hours, ${minutes} minutes ago`;
                      }
                      return (
                        <tr key={customer.id}>
                          <td>{customer.id}</td>
                          <td>
                            {customer.name}
                            <div>
                              {customer.lastTransactionDate
                                ? moment(customer.lastTransactionDate).fromNow()
                                : ""}
                            </div>
                            {customer.blackListed === "1" && (
                              <Badge bg="danger" className="ms-2">
                                {t("common.blacklisted")}
                              </Badge>
                            )}
                            {customer.watch === "1" && (
                              <Badge bg="warning" text="dark" className="ms-2">
                                {t("common.watch")}
                              </Badge>
                            )}

                            {customer.balanceLimit &&
                              customer.balanceLimit !== "0" && (
                                <Badge
                                  bg={
                                    customer.balanceLimit > customer.balance
                                      ? "primary"
                                      : "danger"
                                  }
                                  className="ms-2">
                                  {formatToUrduNumeric(customer.balanceLimit)}
                                </Badge>
                              )}
                          </td>
                          <td>{customer.companyName}</td>
                          <td>{customer.phoneNumber}</td>
                          <td>{customer.address}</td>
                          <td>{customer.transactionCount}</td>
                          <td
                            style={{
                              color: customer.balance >= 0 ? "red" : "blue",
                              fontWeight: "bold",
                            }}>
                            {formatToUrduNumeric(customer.balance)}
                          </td>
                          <td>
                      
                
   
                          <ButtonGroup>
            <Button
                variant="primary"
                onClick={() => handleUserClick(customer.id, "customer")}
                className="kanp-border"
            >
                {t("common.viewEntries")}
            </Button>
            <Button
                variant="primary"
                onClick={() => handleEditUserClick(customer)}
            >
                {t("common.edit")}
            </Button>
        </ButtonGroup>
                            
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

          </>
        )}
        <EditUserModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          customer={selectedCustomerId}
        />
        {activeTab === "NewEntries" && (
          <div>
            {/* JSX for din komponent */}
            <TransactionsTap activeTab="NewEntries" userType={userType} />
          </div>
        )}

        <CreateUserModal
          show={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          userType={userType}
        />
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="xl"
          className="full-screen-modal">
          <Modal.Header closeButton>
            <Modal.Title> {t("table.customerActivity")}Entries</Modal.Title>
          </Modal.Header>
          <Modal.Body className="transactions-modal-body">
            <Row className="justify-content-between">
              <Col xs="auto">
                <h4>
                  {t("table.name")}: {selectedUser?.name}
                </h4>
              </Col>
              <Col xs="auto" className="mx-auto">
                <h4>
                  {t("table.companyName")}: {selectedUser?.companyName}
                </h4>
              </Col>
              <Col xs="auto">
                <h4
                  style={{
                    color: selectedUser?.balance >= 0 ? "red" : "blue",
                  }}>
                  {t("table.balance")}:{" "}
                  {formatToUrduNumeric(-selectedUser?.balance)}
                </h4>
              </Col>
            </Row>

            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">{activeTab}</h1>
                  <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                      <Button variant="outline-secondary" size="sm">
                        Share
                      </Button>
                      <AddTransactionForm
                        show={showAddTransactionModal}
                        user={selectedUser}
                        handleClose={() => setShowModal(false)}
                        customerBalance={
                          selectedUser ? selectedUser.balance : 0
                        }
                        handleTabSelect={handleTabSelect}
                      />
                    </div>
                    <DateFilterDropdown
                      period={selectedPeriod}
                      setPeriod={handlePeriodChange}
                      customStartDate={customStartDate}
                      setCustomStartDate={setCustomStartDate}
                      customEndDate={customEndDate}
                      setCustomEndDate={setCustomEndDate}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Row>
              <Col>
                <TransactionsTable
                  transactions={transactions}
                  selectedUser={selectedUser}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      </Container>
    </>
  );
}

export default UsersTable;

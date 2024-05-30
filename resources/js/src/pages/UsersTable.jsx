import React, { useState, useEffect, useMemo,useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Modal,
  Button,
  FormControl,
  Nav,
  Dropdown,
  Row,
  Col,
  Container,
  Badge,
  ButtonGroup,
  Card,
  DropdownButton,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import CustomerModal from "../components/hooks/statusModal";
import AddTransactionForm from "../utils/AddTransactionForm";
import CreateUserModal from "../utils/CreateUserModal";
import TransactionsTable from "../components/transTable/UserTrans";
import EditUserModal from "../utils/EditUserModal";

import { toPng } from 'html-to-image';

import TransactionsTap from "../components/trans/TransTap";
import { useTranslation } from "react-i18next";

import CustomerStatistics from "../components/dash/shortS";

import CustomersOverBalance from "../components/hooks/Status/balancetracker/index";
import { formatToUrduNumeric, timeAgoInPKT } from "../locales/format";
import { useUsers } from "../fetch/userContext";
import CommentModal from "../components/hooks/Status/comments/CommentsModal"; 
import ShowCommentsModal from "../components/hooks/Status/comments/comments"; // Sørg for at stien matcher placeringen af din fil

function UserTable({ userType }) {
  const { userLists, fetchUsers } = useUsers();
  const { comments } = useUsers();
  const [customers, setCustomers] = useState([]);
  const [enhancedCustomers, setEnhancedCustomers] = useState([]);
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState("30d"); // Startperiode
  const [sortField, setSortField] = useState("lastTransactionDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Mtab");
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedForComments, setSelectedForComments] = useState(null);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    fetchUsers(userType); // Hent brugere, hvis det ikke allerede er gjort
  }, [userType, fetchUsers]);

  useEffect(() => {
    const enhanced = customers.map((customer) => {
      const customerComments = comments.filter(
        (comment) => comment.userId === customer.id
      );
      const isValidBalanceLimit =
        customer.balanceLimit !== "" && customer.balanceLimit !== "0";
      const hasOverBalance =
        isValidBalanceLimit &&
        formatToUrduNumeric(customer.balance) >
          formatToUrduNumeric(customer.balanceLimit);
      return {
        ...customer, // Kopierer eksisterende kundeoplysninger
        comments: customerComments, // Tilføjer kommentarer relateret til kunden
        hasOverBalance, // Angiver om kundens balance er over grænsen (givet at grænsen er gyldig)
      };
    });
    setEnhancedCustomers(enhanced);
  }, [customers, comments]);


  useEffect(() => {
    setSearchTerm("");
    setCustomers(userLists[userType] || []);
  }, [userLists, userType]);

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
  }, [customers, searchTerm, statusFilter, sortField, sortOrder]);


  const fetchTransactions = (userId, period) => {
    const endpoint = `${window.App.url}/transactions/user/${userId}/period?period=${period}`;
    
    return axios.get(endpoint, { withCredentials: true,params: {
      customStartDate: customStartDate,
      customEndDate: customEndDate,
    }, });
  };

  const handleUserClick = (userId) => {
    fetchTransactions(userId, selectedPeriod)
      .then((response) => {
        setTransactions(response.data);
        const user = customers.find((user) => user.id === userId);
        setSelectedUser(user);
        setShowModal(true);
      // console.log("Received transaction data:", response.data); 
      })
      .catch((error) => {
       // console.error("Could not fetch transactions:", error);
      });
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (selectedUser) {
      console.log({ userType });
      fetchTransactions(selectedUser.id, newPeriod)
        .then((response) => {
          if (response && response.data) {
            setTransactions(response.data);
            setShowModal(true);
            console.log("Received transaction data:", response.data);
          } else {
            console.error("Invalid response received:", response);

          }
        })
        .catch((error) => {
          console.error("Could not fetch transactions:", error);
          // Vis en fejlmeddelelse til brugeren eller foretag yderligere fejlhåndtering
        });
    }
  };
  const handleTransactionAdded = () => {
    if (selectedUser) {
      handleUserClick(selectedUser.id); // Genhent transaktioner for den valgte bruger og periode
    }
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };
  const handleCreateUserClick = (userType) => {
    setSelectedUser(null);
    setShowModal(false);
    setShowCreateUserModal(true);
  };
  const tableRef = useRef(null);
  const sortedAndFilteredCustomers = React.useMemo(() => {
    return [...filteredCustomers]
      .map((customer) => {

        const customerComments = comments.filter(
          (comment) => comment.userId === customer.id
        );
        return {
          ...customer,
          comments: customerComments,
        };
      })
      .sort((a, b) => {
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
  }, [filteredCustomers, sortField, sortOrder, comments]); // Tilføj 'comments' som en afhængighed

  const handleEditUserClick = (customer) => {
    setSelectedCustomerId(customer);
    setShowEditModal(true);
  };
  const handleShareClick = async () => {
    
      
      toPng(tableRef.current, { cacheBust: false })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "Table.png";
            link.href = dataUrl;
            link.click();
            console.log(link);
          })
          .catch((err) => {
            console.log(err);
          });
      
      
    
  };
  const handleViewComments = (user) => {
    setSelectedForComments(user); // Åbn modalen med den valgte brugers kommentarer
  };
  
  return (
    <>
      <Card
        style={{
          borderLeft: "none",
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          margin: 0,
          padding: 0,
        }}>
        <Card.Header style={{ margin: 0 }}>
          <div className="d-flex justify-content-between">
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={handleTabSelect}>
              <Nav.Item>
                <Nav.Link eventKey="Mtab">{t(`common.${userType}`)}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="NewEntries">
                  {t("common.newEntries")}
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                <Nav.Link eventKey="ToDoList">{t("common.ToDoList")}</Nav.Link>
              </Nav.Item> */}
            </Nav>
          </div>
        </Card.Header>
        {/* {activeTab === "ToDoList" && (
          <Card.Body style={{ padding: 0, margin: 0 }}>
            <TodoList filteredCustomers={filteredCustomers} />
          </Card.Body>
        )} */}
        {activeTab === "Mtab" && (
          <>
            <Card.Body style={{ padding: 0, margin: 0 }}>
              <Container fluid>
                <Row className="p-1 gy-lg-3">
                  {/* This row could be for customer statistics and actions */}
                  <Col className="p-1 gy-lg-3 d-flex flex-column flex-lg-row justify-content-between">
                    <CustomerStatistics customers={customers} />
                    <div className="d-flex flex-column flex-lg-row">
                      <ButtonGroup className="mb-2 mb-lg-0">
                        <CustomersOverBalance customers={enhancedCustomers} />
                        <CustomerModal enhancedCustomers={enhancedCustomers} />
                        <Button
                          variant="primary"
                          onClick={() => handleCreateUserClick({ userType })}>
                          {`${t("common.addNew")} ${t(`common.${userType}`)}`}
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Col>
                </Row>
                <Row className="p-1 gy-lg-3">
                  {/* Separate or integrated search bar depending on screen size */}
                  <Col>
                    <div className="d-lg-none">
                      {/* This will only display on small screens */}
                      <InputGroup className="mt-1">
                        <FormControl
                          type="search"
                          placeholder={t("common.searchPlaceholder")}
                          aria-label="Search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DropdownButton
                          as={InputGroup.Append}
                          variant="outline-secondary"
                          title={`${t("common.filter")}: ${t(statusFilter)}`}
                          id="input-group-dropdown-2"
                          alignRight>
                          <Dropdown.Item onClick={() => setStatusFilter("all")}>
                            {t("common.all")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setStatusFilter("blacklisted")}>
                            {t("common.blacklisted")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setStatusFilter("watch")}>
                            {t("common.watch")}
                          </Dropdown.Item>
                        </DropdownButton>
                      </InputGroup>
                    </div>
                    <div className="d-none d-lg-flex align-items-center">
                      {/* This will only display on large screens */}
                      <ButtonGroup className=" d-lg-none">
                        <CustomersOverBalance customers={enhancedCustomers} />
                        <CustomerModal enhancedCustomers={enhancedCustomers} />
                        <Button
                          variant="primary"
                          onClick={() => handleCreateUserClick({ userType })}>
                          {`${t("common.addNew")} ${t(`common.${userType}`)}`}
                        </Button>
                      </ButtonGroup>
                      <InputGroup>
                        <FormControl
                          type="search"
                          placeholder={t("common.searchPlaceholder")}
                          aria-label="Search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <DropdownButton
                          as={InputGroup.Append}
                          variant="outline-secondary"
                          title={`${t("common.filter")}: ${t(statusFilter)}`}
                          id="input-group-dropdown-2"
                          alignRight>
                          <Dropdown.Item onClick={() => setStatusFilter("all")}>
                            {t("common.all")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setStatusFilter("blacklisted")}>
                            {t("common.blacklisted")}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setStatusFilter("watch")}>
                            {t("common.watch")}
                          </Dropdown.Item>
                        </DropdownButton>
                      </InputGroup>
                    </div>
                  </Col>
                </Row>
              </Container>

              
              <Row>
                <Col>
                  <CreateUserModal
                    show={showCreateUserModal}
                    onClose={() => setShowCreateUserModal(false)}
                    userType={userType}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  
                  <Table striped bordered responsive="xl">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort("id")}>
                          {t("table.id")}
                        </th>
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
                        const isValidBalanceLimit =
                          customer.balanceLimit !== "" &&
                          customer.balanceLimit !== "0";

                        // Derefter tjekker om kundens nuværende balance er større end deres balancegrænse,
                        // men kun hvis balancegrænsen er gyldig
                        const hasOverBalance =
                          isValidBalanceLimit &&
                          formatToUrduNumeric(customer.balance) >
                            formatToUrduNumeric(customer.balanceLimit);

                        const lastTransactionTime = customer.lastTransactionDate
                          ? timeAgoInPKT(customer.lastTransactionDate)
                          : "No Transactions";

                        return (
                          <tr key={customer.id}>
                            <td>
                              {customer.id}
                              {customer.comments &&
                                customer.comments.length > 0 && (
                                  <Badge
                                    bg="info"
                                    className="m-2"
                                    style={{
                                      height: "20px", // Justeret for bedre synlighed
                                      width: "20px", // Justeret for bedre synlighed
                                      borderRadius: "50%",
                                      display: "inline-block",
                                      cursor: "pointer", // Gør det tydeligt, at det kan klikkes på
                                    }}
                                    onClick={() =>
                                      handleViewComments(customer)
                                    }>
                                    {customer.comments.length}
                                  </Badge>
                                )}
                            </td>
                            <td
                              className="title-item"
                              style={{ position: "relative" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}>
                                {customer.name}
                                {customer.watch === "1" && (
                                  <Badge
                                    bg="warning"
                                    text="dark"
                                    className="ms-2"
                                    style={{
                                      height: "5px",
                                      width: "5px",
                                      borderRadius: "50%",
                                      display: "inline-block",
                                      padding: 0,
                                      marginLeft: "5px",
                                    }}></Badge>
                                )}
                                {customer.blackListed === "1" && (
                                  <Badge
                                    bg="danger"
                                    className="ms-2"
                                    style={{
                                      height: "5px",
                                      width: "5px",
                                      borderRadius: "50%",
                                      display: "inline-block",
                                      padding: 0,
                                      marginLeft: "5px",
                                    }}></Badge>
                                )}
                              </span>
                              <p
                                className="small text-muted card-text"
                                style={{
                                  fontSize: "smaller",
                                  marginTop: "5px",
                                }}>
                                {lastTransactionTime}
                              </p>
                            </td>

                            <td>{customer.companyName}</td>
                            <td>{customer.phoneNumber}</td>
                            <td>{customer.address}</td>
                            <td>{customer.transactionCount}</td>
                            <td
                              className="title-item"
                              style={{ position: "relative" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}>
                                <span
                                  style={{
                                    color:
                                      customer.balance >= 0 ? "red" : "blue",
                                    fontWeight: "bold",
                                  }}>
                                  {formatToUrduNumeric(customer.balance)}
                                </span>
                                {hasOverBalance && (
                                  <Badge
                                    bg="danger"
                                    className="ms-2"
                                    style={{
                                      height: "5px",
                                      width: "5px",
                                      borderRadius: "50%",
                                      display: "inline-block",
                                      padding: 0,
                                      marginLeft: "5px",
                                    }}
                                    onMouseOver={(e) => {
                                      e.target.title = `Over Limit: ${formatToUrduNumeric(
                                        customer.balance - customer.balanceLimit
                                      )}`;
                                    }}></Badge>
                                )}
                              </span>

                              {isValidBalanceLimit && (
                                <p
                                  className="small text-muted card-text"
                                  style={{
                                    fontSize: "smaller",
                                    marginTop: "5px",
                                  }}>
                                  Limit:{" "}
                                  {formatToUrduNumeric(customer.balanceLimit)}
                                </p>
                              )}
                            </td>

                            <td><ButtonGroup>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  handleUserClick(customer.id, "customer")
                                }
                                className="kanp-border">
                                {t("common.viewEntries")}
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => handleEditUserClick(customer)}>
                                {t("common.edit")}
                              </Button>
                              <CommentModal
                                userId={customer.id}
                                comments={customer.comments}
                                onAddComment={(newComment) =>
                                  addComment(customer.id, newComment)
                                }
                              />
                              </ButtonGroup>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </>
        )}
        {selectedForComments && (
          <ShowCommentsModal
            userId={selectedForComments.id}
            comments={selectedForComments.comments}
            onHide={() => setSelectedForComments(null)}
          />
        )}
      </Card>
      <EditUserModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        customer={selectedCustomerId}
      />
      {activeTab === "NewEntries" && (
        <div>
          <TransactionsTap activeTab="NewEntries" userType={userType} />
        </div>
      )}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="fullscreen"
        backdrop="static"
        aria-labelledby="AAModalHeader">
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title id="AAModalHeader">
            <div className="title-container">
              <div className="title-item">
                <p className="header-pretitle text-muted">
                  {t("table.entries")}
                </p>
                <h4 className="header-title text-muted alsoborder">
                  {t(`common.${userType}`)}
                </h4>
              </div>

              {selectedUser?.name && ( // Tjekker, om 'name' er ikke-tom
                <div className="title-item">
                  <p className="header-pretitle text-muted">
                    {t(`table.name`)}
                  </p>
                  <h4 className="header-title ">{selectedUser.name}</h4>
                </div>
              )}
              {selectedUser?.companyName && ( // Tjekker, om 'companyName' er ikke-tom
                <div className="title-item">
                  <p className="header-pretitle text-muted">
                    {t(`table.companyName`)}
                  </p>
                  <h4 className="header-title">{selectedUser.companyName}</h4>
                </div>
              )}
              {selectedUser?.balance &&
                selectedUser.balance !== 0 && ( // Tjekker, om 'balance' er ikke-null og ikke 0
                  <div className="title-item">
                    <p className="header-pretitle text-muted">
                      {t(`table.balance`)}
                    </p>
                    <h4
                      className="header-title alsoborder"
                      style={{
                        color: selectedUser.balance >= 0 ? "red" : "blue",
                      }}>
                      {formatToUrduNumeric(-selectedUser.balance)}
                    </h4>
                  </div>
                )}
              <div className="title-item">
                <p className="header-pretitle text-muted">{t(`table.share`)}</p>
                <h4 className="header-title">
                  <FontAwesomeIcon
                    icon={faShareAlt}
                    onClick={() => handleShareClick()}
                  />
                </h4>
              </div>
              <div className="title-item">
                <p className="header-pretitle text-muted">
                  {t(`common.addNew`)}
                </p>
                <h4 className="header-title">
                  <AddTransactionForm
                    show={showAddTransactionModal}
                    user={selectedUser}
                    handleClose={() => setShowAddTransactionModal(false)}
                    onTransactionAdded={() => {
                      handleTransactionAdded();
                      console.log(selectedUser);
                    }}
                  />
                </h4>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0, margin: 0 }}>
          <TransactionsTable
            transactions={transactions}
            selectedUser={selectedUser}
            period={selectedPeriod}
            setPeriod={handlePeriodChange}
           
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            responsive="sm"
            onTransactionAdded={() => {
              handleTransactionAdded();
              console.log(selectedUser);
            }}
            tableRef={tableRef}
            
          />
        </Modal.Body>
      
      </Modal>
    </>
  );
}

export default UserTable;

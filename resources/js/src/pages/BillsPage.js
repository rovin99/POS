
import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { Eye } from "react-bootstrap-icons"; 

import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap"; 
import styles from "../styles/InvoiceStyles.module.css";

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

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
    // eslint-disable-next-line
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    { title: "ID", field: "id" },
    { title: "Customer Name", field: "customer_name" },
    { title: "Contact No", field: "customer_number" },
    { title: "Subtotal", field: "sub_total" },
    { title: "Tax", field: "tax" },
    { title: "Total Amount", field: "total_amount" },
    {
      title: "Actions",
      field: "actions",
      formatter: (_, row) => (
        <Eye
          size={44}
          onClick={() => {
            setSelectedBill(row);
            setPopupModal(true);
          }}
        />
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between mb-3">
        <h1>Invoice List</h1>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {billsData.map((bill) => (
            <tr key={bill.id}>
              {columns.map((column) =>
                column.formatter? (
                  column.formatter(bill[column.field], bill)
                ) : (
                  <td key={column.field}>{bill[column.field]}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {popupModal && (
        <Modal show={popupModal} onHide={() => setPopupModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div id={styles["invoice-POS"]} ref={componentRef}>
            <center id={styles.top}>
              <div className={styles.logo} />
              <div className={styles.info}>
                < h2 className={styles.h2}>Loren Ipsum</h2>
                <p> Contact : 123456 | Mumbai Maharashtra</p>
              </div>
              {/*End Info*/}
            </center>
            {/*End InvoiceTop*/}
            <div id="mid">
              <div className="mt-2">
                <p>
                  Customer Name : <b>{selectedBill.customer_name}</b>
                  <br />
                  Phone No : <b>{selectedBill.customer_number}</b>
                  <br />
                  Date : <b>{selectedBill && selectedBill.created_at? new Date(selectedBill.created_at).toString().substring(0, 10) : 'Loading...'}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/*End Invoice Mid*/}
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>Item</h2>
                      </td>
                      <td className="Hours">
                        <h2>Qty</h2>
                      </td>
                      <td className="Rate">
                        <h2>Price</h2>
                      </td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                    {selectedBill.cart_items.map((item) => (
                      <>
                        <tr className="service">
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.quantity * item.price}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>tax</h2>
                      </td>
                      <td className="payment">
                        <h2>${selectedBill.tax}</h2>
                      </td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>Grand Total</h2>
                      </td>
                      <td className="payment">
                        <h2>
                          <b>${selectedBill.total_amount}</b>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/*End Table*/}
              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your order!</strong> 10% GST application
                  on total amount.Please note that this is non refundable amount
                  for any assistance please write email
                  <b> help@mydomain.com</b>
                </p>
              </div>
            </div>
            {/*End InvoiceBot*/}
          </div>
          
          

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setPopupModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              Print
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;

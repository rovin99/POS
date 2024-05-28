
import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import { Eye,Gear } from "react-bootstrap-icons"; 

import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap"; 
import styles from "../styles/InvoiceStyles.module.css";
import InvoiceEditor from '../components/InvoiceEditor';
const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showInvoiceEditor, setShowInvoiceEditor] = useState(false);
  const [selectedBillForEditing, setSelectedBillForEditing] = useState(null);

  const handleEditInvoice = (bill) => {
    setSelectedBillForEditing(bill);
    setShowInvoiceEditor(true);
  };
  const getAllBills = async (updatedBill = null) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(`${window.App.url}/api/bills`);
      if (updatedBill) {
        // If an updated bill is provided, replace the corresponding bill in the data array
        const updatedData = data.map((bill) =>
          bill.id === updatedBill.id ? updatedBill : bill
        );
        setBillsData(updatedData);
      } else {
        setBillsData(data);
      }
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
        <>
        <Eye
          size={34}
          onClick={() => {
            setSelectedBill(row);
            setPopupModal(true);
          }}
        />
        <Gear
          size={34}
          onClick={() => handleEditInvoice(row)}
        />
        </>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between mb-3">
        <h1>Invoice List</h1>
      </div>
      {showInvoiceEditor && (
        <InvoiceEditor
          bill={selectedBillForEditing}
          onClose={() => setShowInvoiceEditor(false)}
          getAllBills={getAllBills}
        />
      )}
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
                <div className={styles.normal}>Loren Ipsum</div>
                <p className={styles.p}> Contact : 123456 | Mumbai Maharashtra</p>
              </div>
              {/*End Info*/}
            </center>
            {/*End InvoiceTop*/}
            <div id="mid">
              <div className="mt-2">
                <p className={styles.p}>
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
                        <div className={styles.normal}>Item</div>
                        
                      </td>
                      <td className="Hours">
                        <div className={styles.normal}>Oty</div>
                        
                      </td>
                      <td className="Rate">
                      <div className={styles.normal}>Price</div>
                        
                      </td>
                      <td className="Rate">
                      <div className={styles.normal}>Total</div>
                        
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
                      <div className={styles.normal}>tax</div>
                      </td>
                      <td className="payment">
                      <div className={styles.normal}>${selectedBill.tax}</div>
                        
                      </td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                      <div className={styles.normal}>Grand Total</div>
                        
                      </td>
                      <td className="payment">
                         <div className={styles.normal}> <b>${selectedBill.total_amount}</b></div>
                        
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

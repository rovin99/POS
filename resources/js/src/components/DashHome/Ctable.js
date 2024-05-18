import React from "react";
import { Table, Badge } from "react-bootstrap";

const TransactionsTable = ({ transactions, userType }) => (
  <div className="table-responsive">
  <table className="card-table table-nowrap table table-sm table-hover">
    <thead>
      <tr className="text-muted">
        <th className="text-muted">Name</th>
        <th className="text-muted">#</th>
        <th className="text-muted">Date</th>
        <th className="text-muted">Description</th>
        <th className="text-muted">Due Date</th>

        <th className="text-muted">
          {userType === "client"
            ? "Amount Due (Client)"
            : userType === "supplier"
            ? "Amount Received"
            : "Unknown"}
        </th>
        <th className="text-muted">
          {userType === "client"
            ? "Received (Client)"
            : userType === "supplier"
            ? "Amount Send"
            : "out"}
        </th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((transaction) => {
        const isCredit = transaction.transactionType === "credit";
        const amount = parseFloat(transaction.amount);

        function determineFontColorTransac(value) {
          return value === "debit" ? "blue" : "red";
        }

        return (
          <tr key={transaction.transactionId}>
            <td>{transaction.name}</td>
            <td>{transaction.transactionId}</td>
            <td>
              {transaction.transactionDate
                ? new Date(transaction.transactionDate).toLocaleDateString(
                    "da-DK",
                    { year: "numeric", month: "2-digit", day: "2-digit" }
                  )
                : ""}
            </td>
            <td>{transaction.description || "-"}</td>
            <td>
              {transaction.transactionDueDate === "0000-00-00"
                ? "-"
                : transaction.transactionDueDate}
            </td>

            <td style={{ color: determineFontColorTransac("debit") }}>
              {!isCredit
                ? new Intl.NumberFormat("da-DK", {
                    maximumFractionDigits: 0,
                  }).format(Math.abs(amount))
                : "-"}
            </td>
            <td style={{ color: determineFontColorTransac("credit") }}>
              {isCredit
                ? new Intl.NumberFormat("da-DK", {
                    maximumFractionDigits: 0,
                  }).format(Math.abs(amount))
                : "-"}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
  </div>
);

export default TransactionsTable;

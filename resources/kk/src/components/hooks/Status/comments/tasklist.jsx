import React from 'react';
import moment from 'moment';
import APIConfig from "../../../config";
import { ListGroup, Form, Badge } from 'react-bootstrap';

function CommentsTaskList({ comments }) {

  const updateCommentStatus = async (commentId, newStatus) => {
    const formData = new FormData();
    console.log(commentId);
    console.log(newStatus);
    formData.append("modify", "status");
    formData.append("commentId", commentId);
    formData.append("status", newStatus);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    try {
        const response = await fetch(`${window.App.url}/comments/add`, { // Ændret endpoint for klarhed
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
              'X-CSRF-TOKEN': csrfToken,
            } 
        });
        const data = await response.json();
        if (data.success) {
            console.log("Comment status updated successfully", data.message);
           
            // Her kan du opdatere tilstanden eller UI for at afspejle den opdaterede kommentarstatus
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error updating comment status:", error);
        // Her kan du håndtere og vise fejl
    }
};

  
  return (
    <ListGroup>
      {comments
  .filter(comment => comment.status === "to do" || comment.status === "waiting")
  .map((comment, index) => (
    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
      <Form.Check 
  type="checkbox" 
  id={`check-comment-${comment.commentId}`}
  onChange={(e) => e.target.checked && updateCommentStatus(comment.commentId, 'done')}
>
  <Form.Check.Input type="checkbox" />
  <Form.Check.Label>{comment.comment}</Form.Check.Label>
</Form.Check>
      {comment.transactionId && (
        <Badge bg="info" pill>
          Transaction ID: {comment.transactionId}
        </Badge>
      )}

      <Badge bg="secondary" pill>
      {moment(comment.commentDate).fromNow()}
      </Badge>
    </ListGroup.Item>
))}
    </ListGroup>
  );
}
export default CommentsTaskList;

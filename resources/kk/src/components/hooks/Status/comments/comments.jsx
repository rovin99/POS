import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import {timeAgoInPKT} from '../../../../locales/format';
function ShowCommentsModal({ userId, comments, onHide }) {
  console.log(comments);
  return (
  
    <Modal show={!!userId} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.comment}</p>
              <small>{timeAgoInPKT(comment.commentDate)}</small>
            </div>
          ))
        ) : (
          <p>no Comments.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Luk
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShowCommentsModal;

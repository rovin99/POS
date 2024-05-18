// CommentStatusIcon.jsx
import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaHourglassHalf } from 'react-icons/fa';

const CommentStatusIcon = ({ comments }) => {
  let statusColor = 'green'; // Standard: alle kommentarer er "done"
  let IconComponent = FaCheckCircle; // Standardikon for "done" status

  const hasToDo = comments.some(comment => comment.status === 'to do');
  const hasWaiting = comments.some(comment => comment.status === 'waiting');

  if (hasToDo || hasWaiting) {
    statusColor = hasToDo ? 'red' : 'orange'; // Rød for "to do", orange for "waiting"
    IconComponent = hasToDo ? FaExclamationCircle : FaHourglassHalf; // Ikoner baseret på status
  }

  return <IconComponent color={statusColor} />;
};

export default CommentStatusIcon;

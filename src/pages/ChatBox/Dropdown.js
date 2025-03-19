import { memo } from 'react';
import { FaTrash, FaReply } from 'react-icons/fa';

function Dropdown({ visible, onDelete }) {
 
  return (
    <>
      {visible && (
        <div className="dropdown-chat">
          <FaTrash className="dropdown-chat-icon" onClick={onDelete} />
          <FaReply className="dropdown-chat-icon" />
        </div>
      )}
    </>
  );
}

export default memo(Dropdown)
import { memo } from 'react';
import { FaTrash, FaReply } from 'react-icons/fa';

const Dropdown = memo(({ visible }) => (
  <>
    {visible && (
      <div className="dropdown-chat">
        <FaTrash className="dropdown-chat-icon" />
        <FaReply className="dropdown-chat-icon" />
      </div>
    )}
  </>
));

export default memo(Dropdown)
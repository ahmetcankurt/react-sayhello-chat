import { Link } from "react-router-dom";

const Group = ({ group }) => {
  // global store

  const onSelectChat = (id ) => {
  };

  return (
    <li>
      <Link to="#" onClick={() => onSelectChat(group.id, true)}>
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0 avatar-xs me-2">
            <span className="avatar-title rounded-circle bg-soft-light text-dark">
              #
            </span>
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <p className="text-truncate mb-0">{group.name}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};
const Groups = ({ chatUserDetails }) => {
  const groups =
    chatUserDetails.channels &&
    chatUserDetails.channels.length &&
    chatUserDetails.channels;
  return (
    <div>
      <div className="d-flex">
        <div className="flex-grow-1">
          <h5 className="font-size-11 text-muted text-uppercase">
            Group in common
          </h5>
        </div>
      </div>

      {groups ? (
        <ul className="list-unstyled chat-list mx-n4">
          {(groups || []).map((group, key) => (
            <Group group={group} key={key} />
          ))}
        </ul>
      ) : (
        <p>No Groups</p> 
      )}
    </div>
  );
};

export default Groups;

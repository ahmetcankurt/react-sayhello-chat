import ContactItem from "./ContactItem";
import { memo } from "react";


const CharacterItem = ({
  letterContacts,
  setSelectedUser
}) => {
  return (
    <div>
      <div className="contact-list-title">{letterContacts.letter}</div>
      <ul className="list-unstyled contact-list mb-0">
        {(letterContacts.data || []).map((contact, key) => (
          <ContactItem
            contact={contact}
            key={key}
            index={key}
            setSelectedUser={setSelectedUser}
          />
        ))}
      </ul>
    </div>
  );
};

export default  memo(CharacterItem);

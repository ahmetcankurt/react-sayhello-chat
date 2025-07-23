import { useEffect, useState } from "react";
import { Collapse, Card, CardBody } from "reactstrap";

const Reply = ({ reply, onSetReplyData, chatUserDetails }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!!reply);
  }, [reply]);

  const onClose = () => {
    setIsOpen(false);
    onSetReplyData(null);
  };

  // Örnek kullanıcı, bunu gerçek auth kullanıcısı ile değiştir
  const userProfile = {
    uid: "123",
    firstName: "John",
    lastName: "Doe",
    image: "https://via.placeholder.com/150",
    status: "online",
    lastSeen: "2 hours ago",
  };

  const replyUserName = chatUserDetails?.firstName
    ? `${chatUserDetails.firstName} ${chatUserDetails.lastName}`
    : reply?.sender
    ? `${reply.sender.name} ${reply.sender.surname}`
    : "Unknown";

  const isReplyFromMe =
    reply?.sender?.userId + "" === userProfile.uid + "";

  return (
    <Collapse isOpen={isOpen} className="chat-input-collapse replyCollapse">
      <Card className="mb-0">
        <CardBody className="py-3">
          <div className="replymessage-block mb-0 d-flex align-items-start">
            <div className="flex-grow-1">
              <h5 className="conversation-name">
                {isReplyFromMe ? "You" : replyUserName}
              </h5>

              {reply?.fileType === "text" && reply?.content && (
                <p className="mb-0">{reply.content}</p>
              )}

              {reply?.fileType !== "text" && (
                <p className="mb-0">[{reply.fileType} dosya]</p>
              )}
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                className="btn btn-sm btn-link mt-n2 me-n3 font-size-18"
                onClick={onClose}
              >
                <i className="bx bx-x align-middle"></i>
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </Collapse>
  );
};

export default Reply;

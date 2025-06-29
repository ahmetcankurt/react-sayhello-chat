import classnames from "classnames";
import FormatTime from "../../../hooks/formatTime";
import { API_URL } from "../../../config";
import AudioMessage from "./AudioMessage";

const renderMessageContent = ({ message, isFromMe }) => {
  if (!message?.fileType) return null;

  const { fileType, content, fileUrl, sender, createdAt, isRead } = message;
  const caption = sender ? `${sender.name} ${sender.surname} ${FormatTime(createdAt)}` : FormatTime(createdAt);

  switch (fileType) {
    case "text":
      return (
        <div className="d-flex justify-content-end align-items-end w-100 position-relative">
          <p className="mb-0 ctext-content">{content}</p>
          <small
            className={classnames("ms-2", {
              "text-white": isFromMe,
              "text-muted": !isFromMe,
            })}
            style={{
              fontSize: "10px",
              userSelect: "none",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            {FormatTime(createdAt)}
            {isFromMe && (
              <i
                className={classnames("bx ms-1", {
                  "bx-check-double": isRead,
                  "bx-check": !isRead,
                })}
                style={{ fontSize: "16px" }}
              />
            )}
          </small>
        </div>
      );

    case "image":
      return (
        <a
          href={`${API_URL}${fileUrl}`}
          data-fancybox="gallery"
          data-caption={caption}
          className="d-inline-block w-100"
        >
          <img
            src={`${API_URL}${fileUrl}`}
            alt={sender?.name || "Resim"}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </a>
      );

    case "video":
      return (
        <a
          href={`${API_URL}${fileUrl}`}
          data-fancybox="gallery"
          data-type="iframe"
          data-caption={caption}
          className="d-inline-block w-100"
        >
          <video
            src={`${API_URL}${fileUrl}`}
            controls
            muted
            className="w-100 rounded"
            style={{ maxHeight: "300px", objectFit: "cover", backgroundColor: "#000" }}
          />
        </a>
      );

    case "audio":
      return <AudioMessage src={`${API_URL}${fileUrl}`} />;

    case "file":
      return (
        <a
          href={`${API_URL}${fileUrl}`}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          Dosyayı indir
        </a>
      );

    default:
      return <span className="text-muted">Desteklenmeyen dosya türü</span>;
  }
};

export default renderMessageContent;

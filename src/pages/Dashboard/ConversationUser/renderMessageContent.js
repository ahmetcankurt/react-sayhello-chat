import classnames from "classnames";
import FormatTime from "../../../hooks/formatTime";
import { API_URL } from "../../../config";
import AudioMessage from "./AudioMessage";

const renderMessageContent = ({ message, isFromMe, repliedMessage }) => {

  if (!message?.fileType) return null;

  // Cevaplanan mesaj varsa özet gösterelim
  const renderRepliedPreview = () => {
    if (!repliedMessage) return null;

    const { fileType, content, fileUrl, sender } = repliedMessage;

    let replyContent;

    if (fileType === "text" || !fileType) {
      replyContent = content
        ? content.length > 250
          ? content.slice(0, 250) + "..."
          : content
        : "Metin mesajı";
    } else {
      // Dosya tipi varsa türüne göre küçük önizleme yapabiliriz
      switch (fileType) {
        case "image":
          replyContent = (
            <img
              src={`${API_URL}${fileUrl}`}
              alt="Cevaplanan resim"
              style={{ maxHeight: 120, objectFit: "cover", borderRadius: 3 }}
            />
          );
          break;
        case "video":
          replyContent = (
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className="bx bx-video" style={{ fontSize: 24, marginRight: 8 }}></i>
              <span>Video mesajı</span>
            </div>
          );
          break;
        case "audio":
          replyContent = (
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className="bx bx-microphone" style={{ fontSize: 24, marginRight: 8 }}></i>
              <span>Ses mesajı</span>
            </div>
          );
          break;
        case "file":
          replyContent = (
            <div style={{ display: "flex", alignItems: "center" }}>
              <i className="bx bx-file" style={{ fontSize: 24, marginRight: 8 }}></i>
              <span>Dosya mesajı</span>
            </div>
          );
          break;
        default:
          replyContent = "Medya mesajı";
      }
    }
    return (
      <div className="d-flex">
        <i className="bx bx-reply text-white my-2 p-0"  style={{ fontSize: 24 }}></i>
        <div
          className="reply-box text-start m-2 w-100 ms-0"
          title={`Cevaplanan mesaj: ${content || ""}`}
          onClick={() => {
            const el = document.getElementById(`message-${repliedMessage.messageId}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          style={{ cursor: "pointer", display: "flex", gap: "3px", alignItems: "center" }}
        >
          <strong className="text-black">@{sender?.name || "Bilinmeyen"} :</strong> {replyContent}
        </div>
      </div>

    );
  };


  const { fileType, content, fileUrl, sender, createdAt, isRead } = message;
  const caption = sender ? `${sender.name} ${sender.surname} ${FormatTime(createdAt)}` : FormatTime(createdAt);

  switch (fileType) {
    case "text":
      return (
        <>
          {repliedMessage && (
            <>
              {renderRepliedPreview()}
            </>
          )}
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
        </>
      );

    case "image":
      return (
        <>
          {renderRepliedPreview()}
          <a
            href={`${API_URL}${fileUrl}`}
            data-fancybox="gallery"
            data-caption={caption}
            className="d-inline-block w-100"
          >
            <img
              src={`${API_URL}${fileUrl}`}
              alt={sender?.name || "Resim"}
              className=" rounded w-100"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </a>
        </>
      );

    case "video":
      return (
        <>
          {renderRepliedPreview()}
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
        </>
      );

    case "audio":
      return (
        <>
          {renderRepliedPreview()}
          <AudioMessage src={`${API_URL}${fileUrl}`} />
        </>
      );

    case "file":
      return (
        <>
          {renderRepliedPreview()}
          <a
            href={`${API_URL}${fileUrl}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Dosyayı indir
          </a>
        </>
      );

    default:
      return (
        <>
          {renderRepliedPreview()}
          <span className="text-muted">Desteklenmeyen dosya türü</span>
        </>
      );
  }
};

export default renderMessageContent;
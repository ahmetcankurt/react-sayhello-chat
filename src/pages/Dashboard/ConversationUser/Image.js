    import { memo } from "react";
    import { Link } from "react-router-dom";

    import ImageMoreMenu from "./ImageMoreMenu";


    const Image = ({ message, image, onImageClick, index, onSetReplyData, onDeleteImg }) => {
        const onDelete = () => {
            onDeleteImg(image.id);
        };
        const onClickReply = () => {

            let multiimages = message['image'];

            let results = multiimages.filter((multiimage) => multiimage.id === image.id);

            message['newimage'] = results;

            onSetReplyData(message);

        };
        return (
            <div className="message-img-list">
                <div>
                    <Link
                        className="popup-img d-inline-block"
                        to={"#"}
                        onClick={() => onImageClick(index)}
                    >
                        <img src={image.downloadLink} alt="" className="rounded border" />
                    </Link>
                </div>
                <ImageMoreMenu imagelink={image.downloadLink} onReply={onClickReply} onDelete={onDelete} />
            </div>
        );
    };


    export default memo(Image);
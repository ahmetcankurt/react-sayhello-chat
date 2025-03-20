import { memo } from "react";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import "./isRead.css"


const ISReady = ({ isRead, className = "" }) => (
    <>
        {isRead ? (
            <BsCheck2All className={`is-read ${className}`} />
        ) : (
            <BsCheck2 className={`is-read-gray ${className}`} />
        )}
    </>
);

export default memo(ISReady);

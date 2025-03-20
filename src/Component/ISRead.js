import { memo } from "react";
import { BsCheck2, BsCheck2All } from "react-icons/bs";

const ISReady = ({ isRead }) => (
    <>
        {
            isRead
                ? <BsCheck2All className="ms-2 me-1 " />
                : <BsCheck2 className="mx-2" />
        }
    </>
)

export default memo(ISReady)
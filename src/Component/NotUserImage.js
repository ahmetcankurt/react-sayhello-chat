import { memo } from "react";

const NotUserImage = () => (
    <div className="chat-img-me loaded" >
        <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <circle cx="64" cy="64" r="64" fill="#E0E0E0"></circle>
            <circle cx="64" cy="48" r="24" fill="#B0B0B0"></circle>
            <path d="M64,72 c-18,0 -32,10 -32,22 v6 h64v-6 c0-12-14-22-32-22" fill="#B0B0B0" />
        </svg>
    </div>
);

export default memo(NotUserImage)
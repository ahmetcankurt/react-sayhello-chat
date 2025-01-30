import { memo } from 'react'
import ChatImage from "../../assest/image/chat-Photoroom.png"

function NotChat() {
    return (
        <div className="not-chat">
            <img src={ChatImage} className="not-chat-icon" alt='ChatImage-alt' />
            <p className="wave-text">
                {"Hoş geldiniz!".split("").map((char, index) => (
                    <span
                        key={index}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                        }}
                        className="m-0 p-0"
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </p>
            <p>Sohbete başlamak için bir kullanıcı seçin.</p>
        </div>
    )
}

export default memo(NotChat)
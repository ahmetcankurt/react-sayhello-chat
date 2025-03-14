import { memo } from 'react'
import ChatImage from "../../assets/image/chat-logo.png"
import { motion } from "framer-motion";

function NotChat() {
    return (
        <div className="not-chat">
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >

                <p className="wave-text mb-0">
                    {"Say Hello".split("").map((char, index) => (
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
                <img src={ChatImage} className='not-chat-icon' alt='ChatImage-png' />
            </motion.div>
        </div>
    )
}

export default memo(NotChat)
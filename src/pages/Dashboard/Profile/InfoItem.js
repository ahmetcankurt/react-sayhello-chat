import { memo } from "react";

const InfoItem = ({ iconClass, children, href }) => (
    <div className="d-flex py-2">
        <div className="flex-shrink-0 me-3">
            <i className={`${iconClass} align-middle text-muted`}></i>
        </div>  
        <div className="flex-grow-1">
            {href ? (
                <a
                    href={href}
                    className="text-reset text-decoration-none"
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                    {children}
                </a>
            ) : (
                <p className="mb-0">{children}</p>
            )}
        </div>
    </div>
);

export default memo(InfoItem);
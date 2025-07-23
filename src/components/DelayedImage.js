import { memo, useEffect, useState } from "react";


function DelayedImage({ src, alt = '', className = '', onError = () => { } , style }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoaded(true);
        img.onerror = onError;
    }, [src]);

    if (!loaded) return null; // 👈 hiç bir şey gösterme

    return (
        <img src={src} alt={alt} className={className} onError={onError} style={style} />
    );
};

export default memo(DelayedImage);
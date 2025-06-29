import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../../utils/cropUtils";

const ImageCropper = ({ imageSrc, onCancel, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const file = new File([croppedBlob], `cropped_${Date.now()}.jpg`, { type: "image/jpeg" });
    onCropDone(file);
  };

  return (
    <div className="cropper-wrapper" style={{ position: "relative", width: "100%", height: 400 }}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={4 / 3}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <div style={{ marginTop: 20 }}>
        <button onClick={handleDone}>✔ Kırp ve Kaydet</button>
        <button onClick={onCancel}>İptal</button>
      </div>
    </div>
  );
};

export default ImageCropper;

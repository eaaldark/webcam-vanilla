import React, { useState, useEffect, useRef, useCallback } from "react";

function CameraComponent() {
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [currentResolution, setCurrentResolution] = useState({
    posX: 1280,
    posY: 720,
  });
  const videoRef = useRef();

  const getVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setVideoDevices(videoDevices);
    } catch (error) {
      console.error("Error getting video devices:", error);
    }
  };

  const startCamera = useCallback(async () => {
    if (selectedDevice) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDevice,
            width: { ideal: currentResolution.posX }, // Cambia el ancho deseado aquí
            height: { ideal: currentResolution.posY }, // Cambia el alto deseado aquí
            frameRate: { ideal: 60 },
          },
        });
        console.log("antes", videoRef);
        videoRef.current.srcObject = stream;
        console.log("despues", videoRef);
      } catch (error) {
        console.error("Error starting camera:", error);
      }
    }
  }, [currentResolution.posX, currentResolution.posY, selectedDevice]);

  useEffect(() => {
    getVideoDevices();
  }, []);

  useEffect(() => {
    startCamera();
  }, [selectedDevice, startCamera]);

  return (
    <div>
      <select
        onChange={(event) => setSelectedDevice(event.target.value)}
        value={selectedDevice || ""}>
        <option value="">Selecciona una cámara</option>
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Cámara ${videoDevices.indexOf(device) + 1}`}
          </option>
        ))}
      </select>

      <video
        controls
        style={{
          width: `${currentResolution.posX}px`,
          height: `${currentResolution.posY}px`,
        }}
        autoPlay
        ref={videoRef}
        width={currentResolution.posX}
        height={currentResolution.posY}
        playsInline
        muted
        key={selectedDevice}>
        <source src="" />
      </video>
    </div>
  );
}

export default CameraComponent;

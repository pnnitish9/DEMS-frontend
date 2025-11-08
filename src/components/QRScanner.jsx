import React, { useEffect, useRef, useState } from "react";

export default function QRScanner({ onScan, continuous = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [glow, setGlow] = useState(false);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        await videoRef.current.play();
        tick();
      } catch (e) {
        console.error("Camera error:", e);
      }
    };

    startCamera();

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };

    return stopCamera;
  }, []);

  const tick = () => {
    requestAnimationFrame(tick);

    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0);

    try {
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // ✅ Try QR scanning
      const code = window.jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        setGlow(true);
        setTimeout(() => setGlow(false), 500);

        onScan(code.data);

        // ✅ if continuous == false → stop scanning
        if (!continuous) return;
      }
    } catch (err) {}
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className={`w-full rounded-lg ${
          glow ? "ring-4 ring-green-500 shadow-green-500" : "ring-2 ring-gray-300"
        } transition-all duration-300`}
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

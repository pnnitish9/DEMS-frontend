import React, { useEffect, useRef, useState } from "react";

export default function QRScanner({ onScan }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [glow, setGlow] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);

  useEffect(() => {
    let stream = null;
    let animationId;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        tick();
      } catch (err) {
        console.error("Camera Error:", err);
      }
    };

    const tick = () => {
      animationId = requestAnimationFrame(tick);
      scanFrame();
    };

    const stopCamera = () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animationId);
    };

    startCamera();
    return stopCamera;
  }, []);

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const w = video.videoWidth;
    const h = video.videoHeight;

    if (!w || !h) return;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    const img = ctx.getImageData(0, 0, w, h);

    try {
      const qr = window.jsQR(img.data, w, h, {
        inversionAttempts: "attemptBoth",
      });

      if (qr) {
        const now = Date.now();

        // ✅ Prevent repeated scanning within 1 second
        if (now - lastScanTime < 1000) return;

        setLastScanTime(now);

        // ✅ Glow effect
        setGlow(true);
        setTimeout(() => setGlow(false), 400);

        onScan(qr.data);
      }
    } catch (err) {
      console.error("QR Scan Error:", err);
    }
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className={`w-full rounded-xl bg-black
          ${glow ? "ring-4 ring-green-500 shadow-green-500" : "ring-2 ring-gray-300"} 
          transition-all duration-300`}
      />

      <canvas ref={canvasRef} className="hidden" />

      {/* ✅ QR Guide Frame */}
      <div className="absolute inset-0 border-4 border-white/30 rounded-xl pointer-events-none"></div>
    </div>
  );
}

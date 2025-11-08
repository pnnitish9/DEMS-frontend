import React, { useEffect, useRef, useState } from "react";

export default function QRScanner({ onScan, continuous = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [glow, setGlow] = useState(false);
  const [lastScan, setLastScan] = useState(0); // ✅ Prevent double scanning

  useEffect(() => {
    let stream;
    let animationId;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 1280, height: 720 },
        });

        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);

        await videoRef.current.play();
        scanLoop();
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const scanLoop = () => {
      animationId = requestAnimationFrame(scanLoop);
      scan();
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      cancelAnimationFrame(animationId);
    };

    startCamera();
    return stopCamera;
  }, []);

  /* ✅ Actual scanner logic */
  const scan = () => {
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

        // ✅ prevent duplicate triggering
        if (now - lastScan < 1500) return;

        setLastScan(now);

        // ✅ Glow green for feedback
        setGlow(true);
        setTimeout(() => setGlow(false), 500);

        onScan(qr.data);

        // ✅ Stop after 1 scan if continuous = false
        if (!continuous) return;
      }
    } catch (err) {
      console.error("QR scan error:", err);
    }
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className={`w-full rounded-xl 
          ${glow ? "ring-4 ring-green-500 shadow-lg shadow-green-400" : "ring-2 ring-gray-300"}
          transition-all duration-300 bg-black`}
      />

      <canvas ref={canvasRef} className="hidden" />

      {/* ✅ Nice scanning frame overlay */}
      <div className="absolute inset-0 border-4 border-white/30 rounded-xl pointer-events-none"></div>
    </div>
  );
}

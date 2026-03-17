'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, ScanBarcode, Zap, ZapOff } from 'lucide-react';
import { backdropVariants, slideInBottom } from '@/lib/animations';

interface BarcodeScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

type ScanStatus = 'loading' | 'scanning' | 'error';

const DUP_TIMEOUT_MS  = 1200;
const LOOP_INTERVAL_MS = 120;

export function BarcodeScannerModal({ open, onClose, onScan }: BarcodeScannerModalProps) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const trackRef    = useRef<MediaStreamTrack | null>(null);
  const zxingRef    = useRef<{ reset?: () => void } | null>(null);
  const rafRef      = useRef<number>(0);
  const canvasRef   = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<unknown>(null);

  // hot refs for dedupe — avoid closure staleness in RAF loop
  const lastDecodedRef = useRef('');
  const lastTimeRef    = useRef(0);
  const lastTickRef    = useRef(0);

  const [status,      setStatus]      = useState<ScanStatus>('loading');
  const [error,       setError]       = useState<string | null>(null);
  const [lastDecoded, setLastDecoded] = useState('');
  const [torchOn,     setTorchOn]     = useState(false);
  const [hasTorch,    setHasTorch]    = useState(false);

  // ── Environment checks ────────────────────────────────────────────────────
  const isSecure   = typeof window !== 'undefined' && (
    window.isSecureContext || /^(localhost|127\.0\.0\.1|::1)$/.test(location.hostname)
  );
  const hasMedia   = typeof navigator !== 'undefined' && !!(navigator.mediaDevices?.getUserMedia);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasDetector = typeof window !== 'undefined' && 'BarcodeDetector' in (window as any);

  // ── Stop helpers ──────────────────────────────────────────────────────────
  const stopLoop = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  const stopCamera = useCallback(() => {
    stopLoop();
    try { zxingRef.current?.reset?.(); } catch {}
    zxingRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    trackRef.current  = null;

    const v = videoRef.current;
    if (v) { v.srcObject = null; }

    setTorchOn(false);
    setHasTorch(false);
    setLastDecoded('');
    lastDecodedRef.current = '';
  }, [stopLoop]);

  // ── Native BarcodeDetector RAF loop ───────────────────────────────────────
  const startLoop = useCallback(() => {
    stopLoop();
    const v = videoRef.current;
    if (!v || !detectorRef.current) return;

    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (v.readyState < 2) return;
      if (now - lastTickRef.current < LOOP_INTERVAL_MS) return;
      lastTickRef.current = now;

      const vw = v.videoWidth, vh = v.videoHeight;
      if (!vw || !vh) return;

      // Centre ROI — wide crop for 1D barcodes
      const roiW = Math.floor(vw * 0.85);
      const roiH = Math.floor(vh * 0.50);
      const sx   = Math.floor((vw - roiW) / 2);
      const sy   = Math.floor((vh - roiH) / 2);

      const cnv = canvasRef.current!;
      if (cnv.width !== roiW)  cnv.width  = roiW;
      if (cnv.height !== roiH) cnv.height = roiH;

      cnv.getContext('2d', { willReadFrequently: true })!
        .drawImage(v, sx, sy, roiW, roiH, 0, 0, roiW, roiH);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (detectorRef.current as any).detect(cnv).then((codes: Array<{ rawValue: string }>) => {
        if (!codes?.length) return;
        const raw = (codes[0].rawValue ?? '').trim();
        if (!raw) return;

        const nowMs = Date.now();
        if (raw === lastDecodedRef.current && nowMs - lastTimeRef.current < DUP_TIMEOUT_MS) return;

        lastDecodedRef.current = raw;
        lastTimeRef.current    = nowMs;
        setLastDecoded(raw);
        navigator.vibrate?.(30);
        onScan(raw);
        onClose();
      }).catch(() => {});
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [stopLoop, onScan, onClose]);

  // ── Main camera start ─────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setError(null);
    setStatus('loading');
    lastDecodedRef.current = '';

    if (!isSecure) {
      setError('HTTPS talab qilinadi (yoki localhost)');
      setStatus('error');
      return;
    }
    if (!hasMedia) {
      setError('Brauzer kamera API\'ni qo\'llab-quvvatlamaydi');
      setStatus('error');
      return;
    }

    try {
      stopCamera();

      // Soft permission check (non-blocking on iOS — it just won't have state)
      try {
        if (navigator.permissions?.query) {
          const perm = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (perm.state === 'denied') {
            setError('Kamera bloklangan. Brauzer sozlamalaridan ruxsat bering');
            setStatus('error');
            return;
          }
        }
      } catch {}

      // Multiple constraint attempts — iOS needs facingMode, not deviceId
      const tries: MediaStreamConstraints[] = [
        { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false },
        { video: { facingMode: 'environment' }, audio: false },
        { video: true, audio: false },
      ];

      let stream: MediaStream | null = null;
      let lastErr: Error | null = null;
      for (const c of tries) {
        try { stream = await navigator.mediaDevices.getUserMedia(c); break; }
        catch (e) { lastErr = e as Error; }
      }

      if (!stream) {
        const msg = lastErr?.message ?? '';
        if (/permission|denied|notallowed/i.test(msg) || lastErr?.name === 'NotAllowedError') {
          setError('Kameraga ruxsat berilmagan');
        } else {
          setError(`Kamera ochilmadi: ${lastErr?.name ?? 'Xato'}`);
        }
        setStatus('error');
        return;
      }

      streamRef.current = stream;

      const v = videoRef.current!;
      v.muted        = true;
      v.playsInline  = true;
      // @ts-expect-error — webkit iOS
      v.webkitPlaysInline = true;
      v.srcObject    = stream;

      await new Promise<void>((res) => {
        const onMeta = () => { v.removeEventListener('loadedmetadata', onMeta); res(); };
        v.addEventListener('loadedmetadata', onMeta, { once: true });
      });
      try { await v.play(); } catch {}

      // Capabilities: torch
      try {
        const track = stream.getVideoTracks()[0];
        trackRef.current = track;
        const caps = (track.getCapabilities?.() ?? {}) as Record<string, unknown>;
        if (caps['torch']) setHasTorch(true);
        await track.applyConstraints({ advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet] }).catch(() => {});
      } catch {}

      setStatus('scanning');

      // ── Prefer native BarcodeDetector (iOS 17+, Chrome Android) ──────────
      if (hasDetector) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          detectorRef.current = new (window as any).BarcodeDetector({
            formats: ['code_128', 'code_39', 'itf', 'codabar', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code'],
          });
          startLoop();
          return;
        } catch {}
      }

      // ── ZXing fallback ────────────────────────────────────────────────────
      const [ZXingBrowser, ZXingLib] = await Promise.all([
        import('@zxing/browser'),
        import('@zxing/library'),
      ]);

      const hints = new Map();
      hints.set(ZXingLib.DecodeHintType.TRY_HARDER, true);
      hints.set(ZXingLib.DecodeHintType.POSSIBLE_FORMATS, [
        ZXingLib.BarcodeFormat.CODE_128,
        ZXingLib.BarcodeFormat.CODE_39,
        ZXingLib.BarcodeFormat.ITF,
        ZXingLib.BarcodeFormat.EAN_13,
        ZXingLib.BarcodeFormat.EAN_8,
        ZXingLib.BarcodeFormat.UPC_A,
        ZXingLib.BarcodeFormat.UPC_E,
        ZXingLib.BarcodeFormat.QR_CODE,
      ]);

      const reader = new ZXingBrowser.BrowserMultiFormatReader(hints);
      zxingRef.current = reader as { reset?: () => void };

      // null deviceId = use whatever is already in the video element
      await reader.decodeFromVideoDevice(undefined, v, (result, err) => {
        if (!result) return;
        const text = (result.getText() ?? '').trim();
        if (!text) return;

        const nowMs = Date.now();
        if (text === lastDecodedRef.current && nowMs - lastTimeRef.current < DUP_TIMEOUT_MS) return;
        lastDecodedRef.current = text;
        lastTimeRef.current    = nowMs;

        setLastDecoded(text);
        navigator.vibrate?.(30);
        onScan(text);
        onClose();
        void err; // suppress unused warning
      });

    } catch (e) {
      console.error('[BarcodeScanner]', e);
      setError(`Kamera ochilmadi: ${e instanceof Error ? e.name : 'Xato'}`);
      setStatus('error');
    }
  }, [isSecure, hasMedia, hasDetector, stopCamera, startLoop, onScan, onClose]);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) startCamera();
    return () => stopCamera();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pause loop when tab hides
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) stopLoop();
      else if (open && detectorRef.current) startLoop();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [open, stopLoop, startLoop]);

  // ── Torch toggle ─────────────────────────────────────────────────────────
  const toggleTorch = async () => {
    try {
      const track = trackRef.current;
      if (!track) return;
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      setTorchOn(next);
    } catch {}
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scanner-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="scanner-panel"
            variants={slideInBottom}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 bg-black rounded-t-3xl overflow-hidden"
            style={{ maxHeight: '90dvh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div className="flex items-center gap-2">
                <ScanBarcode className="h-5 w-5 text-brand" />
                <span className="text-white font-semibold text-sm">Barkod skanerlash</span>
              </div>
              <div className="flex items-center gap-2">
                {hasTorch && (
                  <button
                    onClick={toggleTorch}
                    className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                    title="Chiroq"
                  >
                    {torchOn ? <Zap className="h-4 w-4 text-yellow-400" /> : <ZapOff className="h-4 w-4" />}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Camera viewport */}
            <div className="relative mx-5 mb-3 rounded-2xl overflow-hidden bg-zinc-900 aspect-[4/3]">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted
              />

              {/* Scanning overlay */}
              {status === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/5 h-3/5">
                    <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-brand rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-brand rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-brand rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-brand rounded-br-lg" />

                    <motion.div
                      className="absolute left-0 right-0 h-px bg-brand"
                      style={{ boxShadow: '0 0 6px 2px var(--color-brand, #e11d48)' }}
                      animate={{ top: ['8%', '92%', '8%'] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}

              {/* Loading */}
              {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center text-white">
                    <Camera className="h-10 w-10 mx-auto mb-2 opacity-50 animate-pulse" />
                    <p className="text-sm opacity-60">Kamera yoqilmoqda...</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 gap-3">
                  <Camera className="h-10 w-10 text-white/40" />
                  <p className="text-white text-sm font-medium text-center">{error}</p>
                  <button
                    onClick={startCamera}
                    className="px-5 py-2 rounded-xl bg-brand text-brand-fg text-sm font-medium"
                  >
                    Qayta urinish
                  </button>
                </div>
              )}
            </div>

            {/* Hint */}
            <p className="text-center text-xs pb-6 px-5">
              {lastDecoded
                ? <span className="text-brand font-medium">✓ {lastDecoded}</span>
                : <span className="text-white/40">Barkodni ramka ichiga to'g'rilang</span>
              }
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

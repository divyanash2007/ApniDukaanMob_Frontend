import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { X, Camera } from 'lucide-react';

const BarcodeScannerModal = ({ isOpen, onClose, onScan }) => {
    const scannerRef = useRef(null);
    const [scanError, setScanError] = useState('');
    const [isStarting, setIsStarting] = useState(false);

    const cleanupScanner = () => {
        if (scannerRef.current) {
            try {
                scannerRef.current.reset();
            } catch (error) {
                console.error("Failed to clear ZXing scanner. ", error);
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsStarting(true);

            // Give the DOM a moment to render the container
            const timer = setTimeout(() => {
                const codeReader = new BrowserMultiFormatReader();
                scannerRef.current = codeReader;

                codeReader.decodeFromVideoDevice(undefined, 'video', (result, err) => {
                    if (result) {
                        // Success Callback
                        onScan(result.getText());
                        handleClose();
                    }
                    if (err) {
                        // Failure callback (happens constantly while scanning, ignore unless it's a real error)
                    }
                }).then(() => {
                    setIsStarting(false);
                    // store controls if we need to stop later (though reset works on the reader)
                }).catch((err) => {
                    setScanError("Failed to start camera. Please ensure permissions are granted.");
                    setIsStarting(false);
                    console.error("Camera start error:", err);
                });

            }, 100);

            return () => {
                clearTimeout(timer);
                cleanupScanner();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);


    const handleClose = async () => {
        await cleanupScanner();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="glass rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col border border-white/40">
                <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/30">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand/10 p-2 rounded-xl">
                            <Camera className="w-5 h-5 text-brand" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Scan Barcode</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors active:scale-95"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 text-center mb-4">
                            Point your camera at a barcode to scan it automatically.
                        </p>

                        {/* Container must have static position to work best with library */}
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 bg-black min-h-[250px] flex items-center justify-center">
                            {/* Scanning Animation Overlay */}
                            {!isStarting && (
                                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                                    <div className="w-full h-0.5 bg-brand absolute top-0 left-0 right-0 custom-scanner-beam" style={{ boxShadow: '0 0 10px 2px rgba(0, 209, 46, 0.7)' }}></div>
                                </div>
                            )}

                            {isStarting && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/50">
                                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-2"></div>
                                    <span className="text-white font-bold text-sm">Starting Camera...</span>
                                </div>
                            )}
                            <video id="video" className="w-full h-full object-cover"></video>
                        </div>
                    </div>

                    {scanError && (
                        <div className="text-red-500 text-sm font-bold text-center mt-2 bg-red-50 p-2 rounded-xl border border-red-100">
                            {scanError}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/40 bg-white/30 flex justify-center">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 w-full glass-panel text-gray-800 font-bold rounded-xl active:scale-95 shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                 @keyframes scanBeam {
                     0%, 100% { transform: translateY(0); }
                     50% { transform: translateY(250px); }
                 }
                 .custom-scanner-beam {
                     animation: scanBeam 2s ease-in-out infinite;
                 }
            `}} />
        </div>
    );
};

export default BarcodeScannerModal;

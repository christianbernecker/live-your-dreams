'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LdsButton, LdsCard, LdsCardContent } from '@liveyourdreams/design-system-react';

// Pannellum Types (da das Package keine vollständigen Types hat)
declare global {
  interface Window {
    pannellum: {
      viewer: (container: string, config: PannellumConfig) => PannellumViewer;
    };
  }
}

interface PannellumConfig {
  type: 'equirectangular';
  panorama: string;
  autoLoad?: boolean;
  autoRotate?: number;
  compass?: boolean;
  showFullscreenCtrl?: boolean;
  showZoomCtrl?: boolean;
  mouseZoom?: boolean;
  doubleClickZoom?: boolean;
  keyboardZoom?: boolean;
  orientationOnByDefault?: boolean;
  hotSpots?: HotSpot[];
  hotSpotDebug?: boolean;
  backgroundColor?: string | number[];
  preview?: string;
  hfov?: number;
  pitch?: number;
  yaw?: number;
  minHfov?: number;
  maxHfov?: number;
  minPitch?: number;
  maxPitch?: number;
  minYaw?: number;
  maxYaw?: number;
}

interface HotSpot {
  type: 'scene' | 'info';
  pitch: number;
  yaw: number;
  text?: string;
  URL?: string;
  sceneId?: string;
  targetPitch?: number;
  targetYaw?: number;
  targetHfov?: number;
}

interface PannellumViewer {
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
  loadScene: (sceneId: string, targetPitch?: number, targetYaw?: number, targetHfov?: number) => void;
  getScene: () => string;
  addScene: (sceneId: string, config: PannellumConfig) => void;
  removeScene: (sceneId: string) => void;
  toggleFullscreen: () => void;
  getYaw: () => number;
  getPitch: () => number;
  getHfov: () => number;
  setYaw: (yaw: number, animated?: boolean, callback?: Function) => void;
  setPitch: (pitch: number, animated?: boolean, callback?: Function) => void;
  setHfov: (hfov: number, animated?: boolean, callback?: Function) => void;
  startAutoRotate: (speed?: number, pitch?: number) => void;
  stopAutoRotate: () => void;
  destroy: () => void;
}

/**
 * Viewer360 Props
 */
interface Viewer360Props {
  /**
   * URL des 360°-Bildes
   */
  panoramaUrl: string;
  
  /**
   * Preview Thumbnail URL
   */
  previewUrl?: string;
  
  /**
   * Container-Höhe
   */
  height?: number;
  
  /**
   * Auto-Load aktivieren
   */
  autoLoad?: boolean;
  
  /**
   * Auto-Rotation Geschwindigkeit
   */
  autoRotate?: number;
  
  /**
   * Hotspots für interaktive Bereiche
   */
  hotSpots?: HotSpot[];
  
  /**
   * Initiale Kameraposition
   */
  initialView?: {
    yaw?: number;
    pitch?: number;
    hfov?: number;
  };
  
  /**
   * Callback wenn Viewer geladen ist
   */
  onLoad?: (viewer: PannellumViewer) => void;
  
  /**
   * Callback bei Fehlern
   */
  onError?: (error: string) => void;
  
  /**
   * Zeige Vollbild-Button
   */
  showFullscreen?: boolean;
  
  /**
   * Zeige Zoom-Controls
   */
  showZoomControls?: boolean;
  
  /**
   * Zeige Kompass
   */
  showCompass?: boolean;
}

/**
 * Viewer360 Component
 * 
 * 360°-Panorama Viewer basierend auf Pannellum:
 * - Equirectangular Projection
 * - Mouse/Touch Navigation
 * - Hotspots für interaktive Bereiche
 * - Fullscreen Support
 * - Auto-Rotation
 * - Mobile-optimiert
 */
export function Viewer360({
  panoramaUrl,
  previewUrl,
  height = 400,
  autoLoad = true,
  autoRotate,
  hotSpots = [],
  initialView = {},
  onLoad,
  onError,
  showFullscreen = true,
  showZoomControls = true,
  showCompass = false
}: Viewer360Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  /**
   * Pannellum Script dynamisch laden
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.pannellum) {
      const script = document.createElement('script');
      const link = document.createElement('link');
      
      // CSS
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
      
      // JavaScript
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = () => {
        setError('Fehler beim Laden des 360°-Viewers');
        onError?.('Failed to load Pannellum script');
      };
      
      document.head.appendChild(script);
    } else if (window.pannellum) {
      setScriptLoaded(true);
    }
  }, [onError]);

  /**
   * Viewer initialisieren
   */
  const initViewer = () => {
    if (!containerRef.current || !scriptLoaded || !window.pannellum) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const containerId = `viewer-${Math.random().toString(36).substr(2, 9)}`;
      containerRef.current.id = containerId;

      const config: PannellumConfig = {
        type: 'equirectangular',
        panorama: panoramaUrl,
        autoLoad,
        autoRotate,
        compass: showCompass,
        showFullscreenCtrl: showFullscreen,
        showZoomCtrl: showZoomControls,
        mouseZoom: true,
        doubleClickZoom: true,
        keyboardZoom: true,
        orientationOnByDefault: false,
        hotSpots,
        preview: previewUrl,
        backgroundColor: [0, 0, 0],
        
        // Initiale Ansicht
        hfov: initialView.hfov || 90,
        pitch: initialView.pitch || 0,
        yaw: initialView.yaw || 0,
        
        // Limits
        minHfov: 50,
        maxHfov: 120,
        minPitch: -90,
        maxPitch: 90
      };

      const viewer = window.pannellum.viewer(containerId, config);

      // Event Handlers
      viewer.on('load', () => {
        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.(viewer);
      });

      viewer.on('error', (errorMsg: string) => {
        setError(errorMsg || '360°-Bild konnte nicht geladen werden');
        setIsLoading(false);
        onError?.(errorMsg);
      });

      viewer.on('errorcleared', () => {
        setError(null);
      });

      viewerRef.current = viewer;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
    }
  };

  /**
   * Viewer zerstören
   */
  const destroyViewer = () => {
    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
        viewerRef.current = null;
        setIsLoaded(false);
      } catch (err) {
        console.error('Error destroying 360° viewer:', err);
      }
    }
  };

  /**
   * Viewer neu laden
   */
  const reloadViewer = () => {
    destroyViewer();
    setTimeout(initViewer, 100);
  };

  // Initialisiere Viewer wenn Script geladen
  useEffect(() => {
    if (scriptLoaded && panoramaUrl) {
      initViewer();
    }
    
    return destroyViewer;
  }, [scriptLoaded, panoramaUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return destroyViewer;
  }, []);

  /**
   * Vollbild Toggle
   */
  const toggleFullscreen = () => {
    if (viewerRef.current) {
      viewerRef.current.toggleFullscreen();
    }
  };

  /**
   * Auto-Rotation Toggle
   */
  const toggleAutoRotate = () => {
    if (viewerRef.current) {
      if (autoRotate) {
        viewerRef.current.stopAutoRotate();
      } else {
        viewerRef.current.startAutoRotate(-2); // 2 Grad/Sekunde
      }
    }
  };

  return (
    <LdsCard>
      <LdsCardContent className="p-0">
        <div className="relative">
          {/* Viewer Container */}
          <div
            ref={containerRef}
            style={{ height: `${height}px` }}
            className="w-full rounded-lg overflow-hidden bg-gray-900"
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p>360°-Bild wird geladen...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  360°-Ansicht nicht verfügbar
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <LdsButton onClick={reloadViewer} variant="outline">
                  Erneut versuchen
                </LdsButton>
              </div>
            </div>
          )}

          {/* Custom Controls */}
          {isLoaded && (
            <div className="absolute top-4 right-4 flex gap-2">
              <LdsButton
                size="sm"
                variant="secondary"
                onClick={toggleAutoRotate}
                title="Auto-Rotation umschalten"
              >
                🔄
              </LdsButton>
              
              {showFullscreen && (
                <LdsButton
                  size="sm"
                  variant="secondary"
                  onClick={toggleFullscreen}
                  title="Vollbild"
                >
                  ⛶
                </LdsButton>
              )}
            </div>
          )}

          {/* Info Overlay */}
          {isLoaded && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded text-sm">
              🖱️ Maus: Drehen | 🖱️ Rad: Zoom | 📱 Touch: Pinch & Drag
            </div>
          )}
        </div>
      </LdsCardContent>
    </LdsCard>
  );
}

/**
 * Hook für Viewer Control (für externe Steuerung)
 */
export function useViewer360Control(viewer: PannellumViewer | null) {
  const setView = (yaw?: number, pitch?: number, hfov?: number, animated = true) => {
    if (!viewer) return;
    
    if (yaw !== undefined) viewer.setYaw(yaw, animated);
    if (pitch !== undefined) viewer.setPitch(pitch, animated);
    if (hfov !== undefined) viewer.setHfov(hfov, animated);
  };

  const getView = () => {
    if (!viewer) return { yaw: 0, pitch: 0, hfov: 90 };
    
    return {
      yaw: viewer.getYaw(),
      pitch: viewer.getPitch(),
      hfov: viewer.getHfov()
    };
  };

  const startAutoRotate = (speed = -2) => {
    viewer?.startAutoRotate(speed);
  };

  const stopAutoRotate = () => {
    viewer?.stopAutoRotate();
  };

  return {
    setView,
    getView,
    startAutoRotate,
    stopAutoRotate
  };
}

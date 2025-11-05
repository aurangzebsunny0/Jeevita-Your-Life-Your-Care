import React, { useState, useRef } from 'react';
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Slider } from './ui/slider';

interface ImageUploadWithCropProps {
  onImageSelected: (imageData: string) => void;
  currentImage?: string;
  aspectRatio?: number;
  label?: string;
}

export function ImageUploadWithCrop({ 
  onImageSelected, 
  currentImage, 
  aspectRatio = 1,
  label = "Upload Image" 
}: ImageUploadWithCropProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setShowCropDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (!canvasRef.current || !previewUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const size = 400;
      canvas.width = size;
      canvas.height = size / aspectRatio;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      
      const drawWidth = img.width;
      const drawHeight = img.height;
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      onImageSelected(croppedImage);
      setPreviewUrl(croppedImage);
      setShowCropDialog(false);
      setZoom(1);
      setRotation(0);
    };
    img.src = previewUrl;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      <div className="flex items-center gap-4">
        {previewUrl && (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              onClick={() => setPreviewUrl('')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 border-2 border-dashed border-amber-300 rounded-lg p-6 hover:border-amber-500 hover:bg-amber-50/50 transition-all cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="bg-amber-100 group-hover:bg-amber-200 p-3 rounded-full transition-colors">
              <Upload className="h-6 w-6 text-amber-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Click to upload</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adjust Image</DialogTitle>
            <DialogDescription>
              Crop, zoom, and rotate your image to fit perfectly
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '400px' }}>
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s'
                }}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="max-w-full max-h-full"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s'
                  }}
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" />
                  Zoom: {zoom.toFixed(1)}x
                </label>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Rotation: {rotation}°
                </label>
                <Slider
                  value={[rotation]}
                  onValueChange={(value) => setRotation(value[0])}
                  min={0}
                  max={360}
                  step={15}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCropDialog(false);
                  setZoom(1);
                  setRotation(0);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCrop}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

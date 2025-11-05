import React, { useState } from 'react';
import { Upload, Shield, Clock, Pill, FileText, CheckCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface PrescriptionUploadSectionProps {
  onNavigate: (page: string) => void;
}

export function PrescriptionUploadSection({ onNavigate }: PrescriptionUploadSectionProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const features = [
    { icon: Shield, title: 'Secure Upload', description: 'Your prescription is safely encrypted' },
    { icon: Clock, title: 'Quick Processing', description: 'Get medicines delivered in 24-48 hours' },
    { icon: Pill, title: 'Verified Medicines', description: 'Only authentic medicines from licensed pharmacies' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error('Please upload an image or PDF file');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(''); // PDF doesn't need preview
      }
    }
  };

  const handleUpload = () => {
    if (!user) {
      toast.error('Please login to upload prescription');
      onNavigate('login');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);

    // Simulate upload and send to admin
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const prescriptionData = {
          id: Date.now().toString(),
          userId: user.id || 'user1',
          userName: user.name,
          userEmail: user.email,
          image: reader.result as string,
          status: 'pending',
          uploadDate: new Date().toLocaleString(),
          notes: '',
        };

        // Get existing prescriptions from localStorage
        const existingPrescriptions = JSON.parse(
          localStorage.getItem('adminPrescriptions') || '[]'
        );

        // Add new prescription
        existingPrescriptions.push(prescriptionData);

        // Save to localStorage
        localStorage.setItem(
          'adminPrescriptions',
          JSON.stringify(existingPrescriptions)
        );

        setUploading(false);
        setShowUploadDialog(false);
        setSelectedFile(null);
        setPreviewUrl('');
        
        toast.success('Prescription uploaded successfully! Our pharmacist will review it soon.');
      };
      reader.readAsDataURL(selectedFile);
    }, 1500);
  };

  const handleOpenDialog = () => {
    if (!user) {
      toast.error('Please login to upload prescription');
      onNavigate('login');
      return;
    }
    setShowUploadDialog(true);
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-amber-700 px-4 py-2 rounded-full mb-6">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Easy Prescription Upload</span>
              </div>

              <h2 className="text-gray-900 mb-4">
                Upload Your Prescription
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Simply upload your prescription and we'll take care of the rest. Our pharmacists verify each prescription before processing your order.
              </p>

              {/* Features */}
              <div className="space-y-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">{feature.title}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleOpenDialog}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 shadow-lg shadow-amber-500/30"
              >
                Upload Prescription Now
                <Upload className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Right: Upload Preview */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-amber-500/20 border-2 border-amber-200">
                {/* Upload Area */}
                <div 
                  onClick={handleOpenDialog}
                  className="border-2 border-dashed border-amber-300 rounded-2xl p-12 text-center bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 transition-colors group cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-gray-900 mb-2">Click to upload prescription</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-3">PNG, JPG, PDF up to 10MB</p>
                </div>

                {/* Steps */}
                <div className="mt-6 space-y-3">
                  {[
                    'Upload your prescription',
                    'Our pharmacist verifies it',
                    'Add medicines to cart',
                    'Fast delivery to your doorstep',
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md shadow-amber-500/30">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-600" />
              Upload Prescription
            </DialogTitle>
            <DialogDescription>
              Upload your prescription image or PDF. Our pharmacist will review and verify it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Select Prescription File</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-amber-500 file:to-orange-500
                    file:text-white
                    hover:file:from-amber-600 hover:file:to-orange-600
                    file:cursor-pointer cursor-pointer"
                />
              </div>
            </div>

            {/* Preview */}
            {selectedFile && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border-2 border-amber-200 rounded-xl p-4 bg-amber-50">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Prescription preview" 
                      className="w-full h-64 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                      <p className="text-gray-600">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowUploadDialog(false);
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
              >
                {uploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Prescription
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, Music, Video, Loader2 } from 'lucide-react';
import { convertVideoToMP3 } from '@/lib/ffmpeg';
import DragDropZone from './DragDropZone';

export default function VideoConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (file, errorMessage) => {
    setSelectedFile(file);
    setError(errorMessage);
    setConvertedBlob(null);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setProgress(0);
    setError(null);

    try {
      const blob = await convertVideoToMP3(selectedFile, (progressValue) => {
        setProgress(progressValue);
      });

      setConvertedBlob(blob);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการแปลงไฟล์: ' + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob) return;

    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    // Remove any video extension and add .mp3
    const fileName = selectedFile.name.replace(/\.[^/.]+$/, '') + '.mp3';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Video className="h-6 w-6" />
            Video to MP3 Converter
          </CardTitle>
          <CardDescription className="text-base">
            แปลงไฟล์วิดีโอเป็นไฟล์เสียง MP3 ได้อย่างง่ายดาย
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag and Drop Zone */}
          <DragDropZone 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            error={error}
          />

          {/* Convert Button */}
          <Button
            onClick={handleConvert}
            disabled={!selectedFile || isConverting}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isConverting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                กำลังแปลง...
              </>
            ) : (
              <>
                <Music className="h-5 w-5 mr-2" />
                แปลงเป็น MP3
              </>
            )}
          </Button>

          {/* Progress Bar */}
          {isConverting && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>ความคืบหน้า</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
          )}

          {/* Download Button */}
          {convertedBlob && !isConverting && (
            <Button
              onClick={handleDownload}
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              ดาวน์โหลด MP3
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-xl">วิธีใช้งาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <p>ลากไฟล์วิดีโอมาวางในพื้นที่ หรือคลิกเพื่อเลือกไฟล์</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <p>คลิก "แปลงเป็น MP3" เพื่อเริ่มกระบวนการแปลง</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <p>รอให้การแปลงเสร็จสิ้น (อาจใช้เวลาสักครู่)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <p>คลิก "ดาวน์โหลด MP3" เพื่อบันทึกไฟล์เสียง</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

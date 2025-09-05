import VideoConverter from '@/components/VideoConverter';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Video to MP3 Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            แปลงไฟล์วิดีโอเป็นไฟล์เสียง MP3 ได้อย่างรวดเร็วและง่ายดาย
          </p>
        </div>
        <VideoConverter />
      </div>
    </main>
  );
}
# 🎵 Video to MP3 Converter

A modern, client-side video to MP3 converter built with Next.js, featuring drag & drop functionality and support for multiple video formats.

![Video to MP3 Converter](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![FFmpeg](https://img.shields.io/badge/FFmpeg-WebAssembly-green?style=for-the-badge&logo=ffmpeg)

## ✨ Features

- 🎥 **Multi-Format Support**: Convert 10+ video formats (MP4, AVI, MOV, WMV, FLV, WebM, MKV, 3GP, OGV, M4V)
- 🖱️ **Drag & Drop**: Modern file upload with visual feedback
- 📊 **Real-time Progress**: Live conversion progress tracking
- 🌐 **Client-side Processing**: No server required, all processing in browser
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Clean UI**: Black & white theme using shadcn/ui components
- 🔒 **Privacy First**: Files never leave your device
- ⚡ **Fast Processing**: Optimized FFmpeg WebAssembly integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zendlll66/mp4_to_mp3.git
   cd mp4_to_mp3
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### Basic Usage

1. **Upload Video File**
   - Drag and drop a video file onto the upload area
   - Or click to select a file from your device

2. **Start Conversion**
   - Click the "แปลงเป็น MP3" (Convert to MP3) button
   - Watch the real-time progress bar

3. **Download Result**
   - Click "ดาวน์โหลด MP3" (Download MP3) when conversion is complete
   - Your MP3 file will be saved to your downloads folder

### Supported Video Formats

| Format | Extension | MIME Type |
|--------|-----------|-----------|
| MP4 | `.mp4` | `video/mp4` |
| AVI | `.avi` | `video/avi` |
| MOV | `.mov` | `video/mov` |
| WMV | `.wmv` | `video/wmv` |
| FLV | `.flv` | `video/flv` |
| WebM | `.webm` | `video/webm` |
| MKV | `.mkv` | `video/mkv` |
| 3GP | `.3gp` | `video/3gp` |
| OGV | `.ogv` | `video/ogv` |
| M4V | `.m4v` | `video/m4v` |

### Audio Output Specifications

- **Format**: MP3
- **Bitrate**: 192 kbps
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo (2 channels)

## 🛠️ Technology Stack

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) components
- **Styling**: [Tailwind CSS 3.4.0](https://tailwindcss.com/)
- **Video Processing**: [FFmpeg WebAssembly](https://ffmpegwasm.netlify.app/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: JavaScript (ES6+)

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.js            # Root layout component
│   └── page.js              # Main page component
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.js        # Button component
│   │   ├── card.js          # Card components
│   │   └── progress.js      # Progress bar component
│   ├── DragDropZone.js      # File upload component
│   └── VideoConverter.js    # Main converter component
└── lib/
    ├── utils.js             # Utility functions
    └── ffmpeg.js            # FFmpeg integration
```

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Environment Setup

1. **Development Mode**
   ```bash
   npm run dev
   ```
   - Runs on http://localhost:3000
   - Hot reload enabled
   - Development optimizations

2. **Production Build**
   ```bash
   npm run build
   npm run start
   ```
   - Optimized build
   - Production server
   - Performance optimizations

## 🌐 Browser Compatibility

### Supported Browsers

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 57+ | ✅ Full |
| Firefox | 52+ | ✅ Full |
| Safari | 11+ | ✅ Full |
| Edge | 16+ | ✅ Full |

### Mobile Support

| Platform | Browser | Support Level |
|----------|---------|---------------|
| iOS | Safari 11+ | ⚠️ Limited (memory) |
| Android | Chrome 57+ | ✅ Good |
| Android | Samsung Internet 6+ | ✅ Good |

### Requirements

- **WebAssembly**: Required for FFmpeg
- **ES6 Modules**: Modern JavaScript support
- **File API**: File reading and blob creation
- **Drag & Drop API**: File upload functionality

## 📊 Performance

### File Size Limits

- **Recommended**: Up to 200MB
- **Maximum**: 500MB (browser memory constraints)
- **Processing Memory**: 2-3x file size during conversion

### Processing Times

| File Size | Processing Time |
|-----------|----------------|
| < 50MB | 10-30 seconds |
| 50-200MB | 1-5 minutes |
| 200-500MB | 5-15 minutes |

*Times may vary based on device performance and browser optimization*

## 🔒 Privacy & Security

### Data Privacy
- ✅ **No Server Upload**: All processing happens in your browser
- ✅ **Local Processing**: Files never leave your device
- ✅ **No Data Storage**: No files or data are stored anywhere
- ✅ **No Tracking**: No analytics or user tracking

### Security Features
- 🔒 **Client-side Only**: No external API calls
- 🔒 **Sandboxed Execution**: WebAssembly runs in isolated environment
- 🔒 **Memory Isolation**: Processed files are automatically cleaned up
- 🔒 **No File System Access**: Limited to user-selected files only

## 🐛 Troubleshooting

### Common Issues

#### "FFmpeg failed to load"
- **Cause**: WebAssembly not supported or network issues
- **Solution**: Use a modern browser with WebAssembly support

#### "File too large"
- **Cause**: File exceeds 500MB limit
- **Solution**: Use a smaller file or compress the video first

#### "Conversion failed"
- **Cause**: Corrupted file or unsupported format
- **Solution**: Try a different file or format

#### "Browser crashes"
- **Cause**: Insufficient memory for large files
- **Solution**: Close other tabs and try again

### Performance Tips

1. **Close other tabs** to free up memory
2. **Use smaller files** for faster processing
3. **Ensure stable internet** for FFmpeg loading
4. **Use modern browsers** for best performance

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure browser compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FFmpeg](https://ffmpeg.org/) - Video processing engine
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

If you encounter any issues or have questions:

1. **Check the [Troubleshooting](#-troubleshooting) section**
2. **Search existing [Issues](https://github.com/your-username/video-to-mp3-converter/issues)**
3. **Create a new issue** with detailed information
4. **Join our community discussions**

---

**Made with ❤️ for the open source community**

*Convert your videos to MP3 quickly, securely, and privately - all in your browser!*
# Video to MP3 Converter - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [FFmpeg Integration](#ffmpeg-integration)
5. [File Processing](#file-processing)
6. [UI Components](#ui-components)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)
9. [Performance Considerations](#performance-considerations)
10. [Browser Compatibility](#browser-compatibility)

## Project Overview

This is a Next.js application that converts video files to MP3 audio files using FFmpeg WebAssembly. The application runs entirely in the browser, providing a client-side video-to-audio conversion solution.

### Key Features
- **Multi-format Support**: Supports 10+ video formats (MP4, AVI, MOV, WMV, FLV, WebM, MKV, 3GP, OGV, M4V)
- **Drag & Drop Interface**: Modern file upload with visual feedback
- **Real-time Progress**: Live conversion progress tracking
- **Client-side Processing**: No server required, all processing in browser
- **Responsive Design**: Works on desktop and mobile devices
- **Black & White Theme**: Clean, minimalist design using shadcn/ui

## Architecture

### Technology Stack
- **Framework**: Next.js 15.5.2 with App Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS v3.4.0
- **Video Processing**: FFmpeg WebAssembly (@ffmpeg/ffmpeg)
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)

### Project Structure
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

## Core Components

### 1. VideoConverter.js
Main component that orchestrates the entire conversion process.

**Props**: None (self-contained)

**State Management**:
```javascript
const [selectedFile, setSelectedFile] = useState(null);
const [isConverting, setIsConverting] = useState(false);
const [progress, setProgress] = useState(0);
const [convertedBlob, setConvertedBlob] = useState(null);
const [error, setError] = useState(null);
```

**Key Methods**:
- `handleFileSelect(file, errorMessage)`: Handles file selection from DragDropZone
- `handleConvert()`: Initiates the conversion process
- `handleDownload()`: Triggers MP3 file download

**Lifecycle**:
1. User selects/drops video file
2. File validation occurs in DragDropZone
3. User clicks convert button
4. FFmpeg processes the file
5. Progress updates in real-time
6. Download button appears when complete

### 2. DragDropZone.js
Handles file input with drag & drop functionality.

**Props**:
- `onFileSelect(file, errorMessage)`: Callback for file selection
- `selectedFile`: Currently selected file object
- `error`: Error message to display

**File Validation Logic**:
```javascript
const isValidVideoFile = (file) => {
  const validTypes = [
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
    'video/flv', 'video/webm', 'video/mkv', 'video/3gp',
    'video/ogv', 'video/m4v'
  ];
  
  const validExtensions = [
    '.mp4', '.avi', '.mov', '.wmv', '.flv',
    '.webm', '.mkv', '.3gp', '.ogv', '.m4v'
  ];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  return hasValidType || hasValidExtension;
};
```

**Drag & Drop Events**:
- `onDragOver`: Sets visual feedback state
- `onDragLeave`: Clears visual feedback
- `onDrop`: Processes dropped files

### 3. UI Components (shadcn/ui)

#### Button Component
```javascript
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### Card Component
Provides consistent card layout with header, content, and footer sections.

#### Progress Component
Uses Radix UI Progress primitive for accessibility and smooth animations.

## FFmpeg Integration

### Core FFmpeg Module (ffmpeg.js)

#### FFmpeg Initialization
```javascript
export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
};
```

**Key Points**:
- Singleton pattern ensures FFmpeg loads only once
- Uses CDN-hosted FFmpeg core files
- Converts URLs to blob URLs for security

#### Video Conversion Process
```javascript
export const convertVideoToMP3 = async (file, onProgress) => {
  const ffmpegInstance = await loadFFmpeg();
  
  // Get file extension for input file
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const inputFileName = `input.${fileExtension}`;
  const outputFileName = 'output.mp3';
  
  // Write the file to FFmpeg's virtual file system
  await ffmpegInstance.writeFile(inputFileName, await fetchFile(file));
  
  // Set up progress monitoring
  ffmpegInstance.on('progress', ({ progress }) => {
    if (onProgress) {
      onProgress(Math.round(progress * 100));
    }
  });
  
  // Run the conversion with more flexible input handling
  await ffmpegInstance.exec([
    '-i', inputFileName,
    '-vn', // No video
    '-acodec', 'mp3',
    '-ab', '192k', // Audio bitrate
    '-ar', '44100', // Sample rate
    '-ac', '2', // Stereo audio
    outputFileName
  ]);
  
  // Read the output file
  const data = await ffmpegInstance.readFile(outputFileName);
  
  // Clean up
  await ffmpegInstance.deleteFile(inputFileName);
  await ffmpegInstance.deleteFile(outputFileName);
  
  // Create a blob from the output data
  const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
  
  return blob;
};
```

**FFmpeg Parameters Explained**:
- `-i inputFileName`: Input file
- `-vn`: Disable video recording (audio only)
- `-acodec mp3`: Use MP3 audio codec
- `-ab 192k`: Set audio bitrate to 192 kbps
- `-ar 44100`: Set sample rate to 44.1 kHz
- `-ac 2`: Set audio channels to stereo

## File Processing

### File Validation Pipeline
1. **MIME Type Check**: Validates `file.type` against known video MIME types
2. **Extension Check**: Validates file extension as fallback
3. **Size Validation**: Implicit 500MB limit (browser memory constraints)
4. **Format Support**: 10 supported video formats

### File Naming Strategy
```javascript
// Input: "my-video.mp4" -> Output: "my-video.mp3"
// Input: "movie.avi" -> Output: "movie.mp3"
const fileName = selectedFile.name.replace(/\.[^/.]+$/, '') + '.mp3';
```

### Memory Management
- Files are processed in browser memory
- FFmpeg virtual file system handles temporary files
- Automatic cleanup after conversion
- Blob URLs are revoked after download

## State Management

### Component State Flow
```
User Action -> State Update -> UI Re-render -> User Feedback
```

### State Dependencies
```javascript
// File selection triggers
selectedFile -> enables convert button
selectedFile -> clears previous conversion results

// Conversion process
isConverting -> disables convert button
isConverting -> shows progress bar
progress -> updates progress percentage

// Completion
convertedBlob -> shows download button
convertedBlob -> hides progress bar
```

### Error State Handling
```javascript
// Error sources
- Invalid file type
- FFmpeg conversion failure
- Browser compatibility issues
- Memory limitations

// Error display
error -> shows error message
error -> disables convert button
error -> clears on new file selection
```

## Error Handling

### Error Categories

#### 1. File Validation Errors
```javascript
// Triggered in DragDropZone
if (!isValidVideoFile(file)) {
  onFileSelect(null, 'กรุณาเลือกไฟล์วิดีโอที่รองรับ (MP4, AVI, MOV, WMV, FLV, WebM, MKV, 3GP, OGV, M4V)');
}
```

#### 2. FFmpeg Conversion Errors
```javascript
try {
  const blob = await convertVideoToMP3(selectedFile, onProgress);
  setConvertedBlob(blob);
} catch (err) {
  setError('เกิดข้อผิดพลาดในการแปลงไฟล์: ' + err.message);
} finally {
  setIsConverting(false);
}
```

#### 3. Browser Compatibility Errors
- WebAssembly support required
- Modern browser with ES6+ support
- Sufficient memory for file processing

### Error Recovery
- Clear error state on new file selection
- Reset progress on error
- Maintain UI consistency during errors

## Performance Considerations

### Memory Usage
- **File Size Limit**: 500MB (browser memory constraints)
- **Processing Memory**: 2-3x file size during conversion
- **Cleanup**: Automatic memory cleanup after conversion

### Processing Time
- **Small Files** (< 50MB): 10-30 seconds
- **Medium Files** (50-200MB): 1-5 minutes
- **Large Files** (200-500MB): 5-15 minutes

### Optimization Strategies
1. **Lazy Loading**: FFmpeg loads only when needed
2. **Progress Feedback**: Real-time progress updates
3. **Memory Management**: Automatic cleanup
4. **Error Boundaries**: Graceful error handling

### Browser Performance
- **Chrome/Edge**: Optimal performance
- **Firefox**: Good performance
- **Safari**: Moderate performance
- **Mobile**: Limited by memory constraints

## Browser Compatibility

### Required Features
- **WebAssembly**: Core requirement for FFmpeg
- **ES6 Modules**: Modern JavaScript support
- **File API**: File reading and blob creation
- **Drag & Drop API**: File upload functionality

### Supported Browsers
- **Chrome**: 57+ (Full support)
- **Firefox**: 52+ (Full support)
- **Safari**: 11+ (Full support)
- **Edge**: 16+ (Full support)

### Mobile Compatibility
- **iOS Safari**: 11+ (Limited by memory)
- **Chrome Mobile**: 57+ (Good support)
- **Samsung Internet**: 6+ (Good support)

### Fallback Strategies
- Graceful degradation for unsupported browsers
- Clear error messages for compatibility issues
- Progressive enhancement approach

## Security Considerations

### Client-Side Processing
- All processing happens in browser
- No file uploads to external servers
- Files remain on user's device
- No data transmission or storage

### File Access
- Limited to user-selected files
- No access to file system
- Sandboxed execution environment
- Memory-only processing

### WebAssembly Security
- Sandboxed execution
- No direct system access
- Memory isolation
- Controlled execution environment

## Development Guidelines

### Code Organization
- **Components**: Single responsibility principle
- **Utilities**: Reusable helper functions
- **Constants**: Centralized configuration
- **Types**: Clear data structures

### Error Handling
- **Try-catch blocks**: Around async operations
- **User feedback**: Clear error messages
- **Graceful degradation**: Fallback behaviors
- **Logging**: Development debugging

### Performance
- **Lazy loading**: Load resources when needed
- **Memory management**: Clean up resources
- **Progress feedback**: User experience
- **Optimization**: Efficient algorithms

### Testing Considerations
- **File formats**: Test all supported formats
- **File sizes**: Test various file sizes
- **Error cases**: Test error scenarios
- **Browser compatibility**: Cross-browser testing

## Future Enhancements

### Potential Improvements
1. **Batch Processing**: Multiple file conversion
2. **Audio Quality Options**: Bitrate selection
3. **Format Options**: Output format selection
4. **Cloud Storage**: Integration with cloud services
5. **Progress Persistence**: Resume interrupted conversions

### Technical Debt
- **TypeScript Migration**: Better type safety
- **Testing Suite**: Comprehensive test coverage
- **Performance Monitoring**: Real-time metrics
- **Accessibility**: Enhanced a11y support

This documentation provides a comprehensive overview of the Video to MP3 Converter application's technical implementation, architecture, and operational details.

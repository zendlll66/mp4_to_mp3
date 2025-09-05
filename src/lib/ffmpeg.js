import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;

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

// Keep the old function name for backward compatibility
export const convertMP4ToMP3 = convertVideoToMP3;

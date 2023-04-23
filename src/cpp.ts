import { mkdir, cd } from 'shelljs';
import moment from 'moment';
import words from './words.json';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { chunk } from 'lodash';
import { exec } from 'child_process';


const MaxSize = 1200;

const model = 'base';
const chunkCount = 4;
const cppPath = join(`~/temp/whisper.cpp`);
const outputPath = join(__dirname, 'outputs');
if (!existsSync(outputPath)) {
 mkdirSync(outputPath);
}
let times:any[] = [];

const single = async  (word: string) => {
 const start = Date.now();
 const filePath = join(__dirname, 'words-wav', `${word}.wav` );
 const outputFilePath = join(outputPath, `${word}`)
 await new Promise(resolve => {
  exec(`NV_GPU=1 ~/temp/whisper.cpp/main -m ~/temp/whisper.cpp/models/ggml-base.en.bin ${filePath} -of ${outputFilePath} --output-txt -l en`, resolve);
 });
 const end = Date.now();
 const s = moment.duration(end - start, "milliseconds").asSeconds();
 console.log(`${word} took ${s} seconds`);
 times.push({
  word,
  duration: s
 });
}

const runTest = async () => {
 const now = Date.now();
 let chunks = chunk(words, chunkCount)
 console.log(chunks.length);
 for (let chunk of chunks) {
  await Promise.all(chunk.map(single));
  if (times.length > MaxSize) {
   break;
  }
 }
 const seconds = moment.duration(Date.now() - now, "milliseconds").asSeconds();
 console.log('test took ' + seconds + 'seconds');
 writeFileSync(join(__dirname, 'duration.json'), JSON.stringify(times));
};

runTest();
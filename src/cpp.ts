import { mkdir, cd, exec } from 'shelljs';
import moment from 'moment';
import pods from './podlist.json';
import words from './words.json';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { chunk } from 'lodash';
// import { exec } from 'child_process';


const MaxSize = 120;

const model = 'base.en';
const chunkCount = 1;
const cppPath = join(`~/temp/whisper.cpp`);
// const cppPath = `/Volumes/External/workspace/whisper.cpp`;
const audioFolder = 'pods';
const outputPath = join(__dirname, 'outputs');
if (!existsSync(outputPath)) {
 mkdirSync(outputPath);
}
let times:any[] = [];

const single = async  (word: string) => {
 const start = Date.now();
 const filePath = join(__dirname, audioFolder, `${word}.wav` );
 const outputFilePath = join(outputPath, `${word}`)
 await new Promise(resolve => {
  exec(`${cppPath}/main -m ${cppPath}/models/ggml-base.en.bin ${filePath} -of ${outputFilePath} --output-txt -l en`, resolve);
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
 let chunks = chunk(pods.data.list.map(e => e.id), chunkCount)
 for (let chunk of chunks) {
  await Promise.all(chunk.map(single));
  if (times.length > MaxSize) {
   break;
  }
 }
 const seconds = moment.duration(Date.now() - now, "milliseconds").asSeconds();
 console.log('test took ' + seconds + 'seconds');
 writeFileSync(join(__dirname, 'duration_cpp.json'), JSON.stringify(times));
};

runTest();
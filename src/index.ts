import { mkdir, cd, exec } from 'shelljs';
import moment from 'moment';
import words from './words.json';
import pods from './podlist.json';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { chunk } from 'lodash';
// import { exec } from 'child_process';

const model = 'base.en';
const chunkCount = 1;
const outputPath = join(__dirname, 'outputs');
const audioFolder = 'pods';
let MaxSize = 120;
if (!existsSync(outputPath)) {
 mkdirSync(outputPath);
}
let times:any[] = [];


const single = async  (word: string) => {
 const start = Date.now();
 const filePath = join(__dirname, audioFolder, `${word}.wav` );
 await new Promise(resolve => {
  exec(`CUDA_VISIBLE_DEVICES=1 whisper ${filePath} --model ${model} --output_dir ${outputPath} --output_format txt --language en --device cuda`, resolve);
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
 let chunks = chunk(pods.data.list.map(pod => pod.id), chunkCount)
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
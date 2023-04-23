import { exec, mkdir, cd } from 'shelljs';
import moment from 'moment';
import words from './words.json';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { chunk } from 'lodash';

const model = 'large';
const chunkCount = 3;
const outputPath = join(__dirname, 'outputs');
if (!existsSync(outputPath)) {
 mkdirSync(outputPath);
}
let times:any[] = [];

const single = async  (word: string) => {
 const start = Date.now();
 const filePath = join(__dirname, 'words', `${word}.mp3` );
 exec(`whisper ${filePath} --model ${model} --output_dir ${outputPath} --output_format txt --language en`);
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
 }
 const seconds = moment.duration(Date.now() - now, "milliseconds").asSeconds();
 console.log('test took ' + seconds + 'seconds');
 writeFileSync(join(__dirname, 'duration.json'), JSON.stringify(times));
};

runTest();
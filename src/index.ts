import { exec, mkdir, cd } from 'shelljs';
import moment from 'moment';
import words from './words.json';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const model = 'tiny';
const outputPath = join(__dirname, 'outputs');
if (!existsSync(outputPath)) {
 mkdirSync(outputPath);
}

const runTest = async () => {
 const now = Date.now();
 for (let word of words) {
  exec(`whisper ${word}.mp3 --model ${model} --output_dir ${outputPath} --output_format txt`);
  // console.log(word);
 }
 const seconds = moment.duration(Date.now() - now, "milliseconds").asSeconds();
};

runTest();
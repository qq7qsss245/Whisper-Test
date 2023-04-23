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
  const filePath = join(__dirname, 'words', `${word}.mp3` );
  exec(`whisper ${filePath} --model ${model} --output_dir ${outputPath} --output_format txt --language en`);
  // console.log(word);
 }
 const seconds = moment.duration(Date.now() - now, "milliseconds").asSeconds();
 console.log('test took ' + seconds + 'seconds');
};

runTest();
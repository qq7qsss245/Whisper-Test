//
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const gTTS = require('gtts');

const loadWords = async () => {
    const words = readFileSync(join(__dirname, 'EnWords.csv')).toString();
    const lines = words.split('\n');
    const result = lines.map(line => {
        const word = line.split(',')[0].replace(/"/g, "");
        // return `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${word}--_gb_1.mp3`
        return `https://dict.youdao.com/dictvoice?type=0&audio=${word}`;
        // return word;
    });
    // result.map(word => {
    //     const gtts = new gTTS(word, 'en');
    //     const filePath = join(__dirname, 'words', `${word}.mp3`)
    //     gtts.save(filePath);
    // })
    const filePath = join(__dirname, 'words.txt')
    writeFileSync(filePath, result.join(`\n`));
};


loadWords();
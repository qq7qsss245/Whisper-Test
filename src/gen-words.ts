//
import { readFileSync, writeFileSync, createWriteStream } from 'fs';
import { join } from 'path';
import axios from 'axios';
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';

const loadWords = async () => {
    const words = readFileSync(join(__dirname, 'EnWords.csv')).toString();
    const lines = words.split('\n');
    const result = lines.map(line => {
        const word = line.split(',')[0].replace(/"/g, "");
        // return `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${word}--_gb_1.mp3`
        return {
            word,
            url: `https://dict.youdao.com/dictvoice?type=0&audio=${word}`
        };
        // return word;
    });
    for (let item of result) {
        try {
            const filePath = join(__dirname, 'words', `${item.word}.mp3`);
            const ws = createWriteStream(filePath);
            const res = await axios.get(item.url, { responseType: 'stream', timeout: 50000, headers: { 'User-Agent': ua } });
            res.data.pipe(ws);
            console.log(`start downloading ${item.word}.mp3`);
            await new Promise(resolve => {
                res.data.on('close', () => {
                    ws.close();
                    console.log(`${item.word}.mp3 finished`);
                    resolve(null);
                })
            })
        }catch (e) {
            continue;
        }
    }
    // const filePath = join(__dirname, 'words.txt')
    // writeFileSync(filePath, result.join(`\n`));
};


loadWords();
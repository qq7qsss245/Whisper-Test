import { writeFileSync, createWriteStream } from 'fs';
import { join } from 'path';
import podList from './podlist.json'
import axios from 'axios';

const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';


let urls = podList.data.list.map(p => {
 return {
  id: p.id,
  url: p.urls[0]
 }
});


const run = async () => {
 for (let item of urls) {
  try {
   const filePath = join(__dirname, 'pods', `${item.id}.mp3`);
   const ws = createWriteStream(filePath);
   const res = await axios.get(item.url, { responseType: 'stream', timeout: 50000, headers: { 'User-Agent': ua } });
   res.data.pipe(ws);
   console.log(`start downloading ${item.id}.mp3`);
   await new Promise(resolve => {
    res.data.on('close', () => {
     ws.close();
     console.log(`${item.id}.mp3 finished`);
     resolve(null);
    })
   })
  } catch (e) {
   continue;
  }
 }
}

run();
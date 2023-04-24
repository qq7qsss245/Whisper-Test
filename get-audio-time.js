const loader = require('audio-loader');
const durations = require('./src/duration.json');
const cppDurations = require('./src/duration_cpp.json');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const formatted = require('./src/formatted.json');

let result = [];
const run = async () => {
 for (let e of durations ) {
  try {
    const audioPath = path.join(__dirname, 'src', 'pods', `${e.word}.wav`);
   const res = await loader(audioPath);
   console.log(`${e.word}.wav :`, res.duration)
   const m = moment.duration(res.duration, 'seconds');
   const cpp = cppDurations.find(c => c.word ===  e.word);
   result.push({
    ...e,
    playTime: res.duration,
    formatted: `${m.minutes()}:${m.seconds()}`,
    cpp_duration: cpp.duration
   }); 
  }catch (e) {
    continue;
  }
 } 
 fs.writeFileSync(path.join(__dirname, 'src', 'formatted.json'), JSON.stringify(result));
}

const concat = () => {
  let result = formatted.map(f => {
    const cpp = cppDurations.find(c => c.word === f.word);
    return {
      ...f,
      cpp_duration: cpp.duration
    }
  });
  fs.writeFileSync(path.join(__dirname, 'src', 'formatted.json'), JSON.stringify(result));
}

// run();
concat();
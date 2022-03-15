import moment from "moment";

const fs = window.require('fs')

export interface RecordItem {
  timestamp: number,
  name: string,
  score: number
}

const jsonPath = 'src/assets/scoreRecord.json';

export default class RecordClass {
  score: number
  constructor() {
    this.score = 0;
  }

  updateScore(score: number) {
    this.score = score;
  }

  record(name: string) {
    fs.readFile(jsonPath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
      const JSONDATA = JSON.parse(data);
      JSONDATA.record.push({
        timestamp: moment().unix(),
        name,
        score: this.score
      } as RecordItem);

      const recordData = JSON.stringify(JSONDATA);

      fs.writeFileSync(jsonPath, recordData);
    })
  }
}
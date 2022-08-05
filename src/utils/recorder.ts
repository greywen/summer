interface IResultModel {
  id: string;
  data: any;
}

interface IQueuetModel {
  id: string;
  fn: () => Promise<any>;
}

class Recorder {
  private resultList: IResultModel[];
  private queueList: IQueuetModel[];
  private running;

  constructor() {
    this.resultList = [];
    this.queueList = [];
    this.running = false;
  }

  public get(id: string) {
    let data = null;
    this.resultList = this.resultList.filter((x) => {
      if (x.id === id) {
        data = x.data;
      }
      return x;
    });
    return data;
  }

  public async add(item: IQueuetModel) {
    this.queueList.push(item);
    if (this.queueList.length > 0 && !this.running) {
      this.running = true;
      return await this.run();
    }
  }

  public async run() {
    const item = this.queueList.shift();
    if (item) {
      const result = await item.fn().finally(() => {
        this.run();
      });
      this.resultList.push({ id: item.id, data: result });
    } else {
      this.running = false;
    }
  }
}

const recorder = new Recorder();

export default recorder;

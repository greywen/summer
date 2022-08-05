interface IList {
  id: string;
  fn: () => any;
}
export class CodeRunQueue {
  list: IList[];
  index: number;
  running: boolean;
  constructor() {
    this.list = [];
    this.index = 0;
    this.running = false;
  }
  async run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const item = this.list.shift();

    if (item) {
      const data = item.fn().finally(() => {
        _this.run();
      });

      return {
        id: item.id,
        data: data,
      };
    } else {
      this.running = false;
    }
  }

  async add(item: IList) {
    this.list.push(item);
    if (this.list.length > 0 && !this.running) {
      this.running = true;
      return await this.run();
    }
  }
}

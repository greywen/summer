import FileData from '@core/files.data';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InformService {
  /**
   * 获取所有通知
   */
  async getInforms() {
    const informs = await FileData.readInfromFile();
    return informs;
  }
  /**
   * 获取当前通知
   */
  async getCurrentInform() {
    const informs = await FileData.getCurrentInform();
    return informs;
  }

  /**
   * 添加通知
   */
  async addInform(data: any) {
    const reg = new RegExp('-', 'g');
    data.id = uuidv4().replace(reg, '');
    const informs = await FileData.writeInfromFile(data);
    return informs;
  }

  /**
   * 删除通知
   */
  async deleteInform(id: string) {
    const informs = await FileData.deleteInfromFile(id);
    return informs;
  }

  /**
   * 修改通知
   */
  async modifyInform(data: any) {
    const informs = await FileData.modifyInform(data);
    return informs;
  }
}

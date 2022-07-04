import { ITimeSheet } from '@interfaces/timesheet';
import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Socket } from 'socket.io';
import { WsGuard } from '../strategys';
import { now } from '@utils/utils';

@UseGuards(WsGuard)
@WebSocketGateway({ namespace: 'timesheet', cors: '*' })
export class TimeSheetSocket {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  @SubscribeMessage('sendMessage')
  async onEvent(client: Socket, data: ITimeSheet) {
    const _timesheet = await this.redis.get('timesheets');
    const timesheets = <ITimeSheet[]>JSON.parse(_timesheet || '[]');
    const _data = timesheets.find((x) => x.userid === data.userid);
    data.createTime = _data?.createTime || now();
    data.updateTime = now();
    if (_data) {
      // 使用token中的userid=>每用户都只能编辑自己的timesheet不能修改其他用户的
      // _data.userid = client.data.dingTalkUserId;
      _data.userid = data.userid;
      _data.value = data.value;
      _data.createTime = data.createTime || now();
      _data.updateTime = now();
    } else {
      timesheets.push(data);
    }
    await this.redis.set('timesheets', JSON.stringify(timesheets));
    client.broadcast.emit('receiveMessage', data);
  }
}

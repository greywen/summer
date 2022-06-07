import { ITimeSheetData } from '@interfaces/timesheet';
import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Socket } from 'socket.io';
import { WsGuard } from '../strategys';

@UseGuards(WsGuard)
@WebSocketGateway({ namespace: 'timesheet', cors: '*' })
export class TimeSheetSocket {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  @SubscribeMessage('sendMessage')
  async onEvent(client: Socket, data: ITimeSheetData) {
    const _timesheet = await this.redis.get('timesheets');
    const timesheets = <ITimeSheetData[]>JSON.parse(_timesheet || '[]');
    const _data = timesheets.find((x) => x.userid === data.userid);
    if (_data) {
      // 使用token中的userid=>每用户都只能编辑自己的timesheet不能修改其他用户的
      // _data.userid = client.data.dingTalkUserId;
      _data.userid = data.userid;
      _data.value = data.value;
    } else {
      timesheets.push(data);
    }
    await this.redis.set('timesheets', JSON.stringify(timesheets));
    client.broadcast.emit('receiveMessage', data);
  }
}

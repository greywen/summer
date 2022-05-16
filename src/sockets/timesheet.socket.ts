import { ITimeSheetData } from '@interfaces/timesheet';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: "timesheet", cors: "*" })
export class TimeSheetSocket {
    constructor(private readonly redisService: RedisService) { }
    @SubscribeMessage("sendMessage")
    async onEvent(client: Socket, data: ITimeSheetData) {
        const _timesheet = await this.redisService.getClient().get("timesheets");
        let timesheets = <ITimeSheetData[]>JSON.parse(_timesheet || "[]");
        let _data = timesheets.find(x => x.name === data.name);
        if (_data) {
            _data.value = data.value
        } else {
            timesheets.push(data);
        }
        await this.redisService.getClient().set("timesheets", JSON.stringify(timesheets));
        client.broadcast.emit("receiveMessage", data);
    }
}
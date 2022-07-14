import config from '@config/config';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import KcClient from '@utils/kcClient';

@Injectable()
export class KeyCloakSchedule {
  @Cron(config.job.keyCloakAuthRule, { name: 'KeyCloakAuthSchedule' })
  async run() {
    console.log('KeyCloak authenticating...');
    await KcClient.auth();
    console.log('KeyCloak auth successful.');
  }
}

import { registerAs } from '@nestjs/config';
import moment from 'moment-timezone';
import {
  DEFAULT_KEY,
  DEFAULT_PORT,
  DEFAULT_START_AT,
  DEFAULT_TZ,
  DEFAULT_URL,
  ENV_DEVELOP,
} from 'src/common/constants/app';
import { DEFAULT_DATE_FORMAT } from 'src/common/constants/date';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  port: process.env.APP_PORT || DEFAULT_PORT,
  env: process.env.APP_ENV || ENV_DEVELOP,
  key: process.env.APP_KEY || DEFAULT_KEY,
  url: process.env.APP_URL || DEFAULT_URL,
  tz: process.env.TZ || DEFAULT_TZ,

  startAt: moment
    .utc(process.env.APP_START_AT || DEFAULT_START_AT, DEFAULT_DATE_FORMAT)
    .toISOString(),
}));

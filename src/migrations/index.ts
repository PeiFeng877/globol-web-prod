import * as migration_20260221_133413 from './20260221_133413';
import * as migration_20260221_133753 from './20260221_133753';

export const migrations = [
  {
    up: migration_20260221_133413.up,
    down: migration_20260221_133413.down,
    name: '20260221_133413',
  },
  {
    up: migration_20260221_133753.up,
    down: migration_20260221_133753.down,
    name: '20260221_133753'
  },
];

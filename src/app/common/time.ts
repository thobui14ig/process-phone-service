import * as dayjs from 'dayjs';

export function getCurrentSecondTime() {
  return dayjs().valueOf();
}

import dayjs from 'dayjs';

export const formatTimestamp = (timestamp: string): string => {
  return dayjs(timestamp).format('HH:mm:ss DD-MM-YYYY');
}


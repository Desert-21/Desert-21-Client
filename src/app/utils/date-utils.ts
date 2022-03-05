export const parseDate = (str: string): Date => new Date(Date.parse(str));

export const formatSecondsToTimeString = (allSeconds: number): string => {
  const minutes = Math.floor(allSeconds / 60);
  const seconds = Math.floor(allSeconds % 60);
  const minutesStr = formatWith0(minutes);
  const secondsStr = formatWith0(seconds);
  return `${minutesStr}:${secondsStr}`;
}

export const timeStringToTotalSeconds = (timeString: string): number => {
  const[minutesStr, secondsStr] = timeString.split(":");
  const minutes = parseInt(minutesStr);
  const seconds = parseInt(secondsStr);
  return minutes * 60 + seconds;
}

export const millisecondsTo = (date: Date) => {
  return date.getTime() - new Date().getTime();
}

export const millisecondsFrom = (date: Date) => {
  return new Date().getTime() - date.getTime();
}

const formatWith0 = (num: number): string => {
  if (num < 10) {
    return `0${num}`;
  }
  return num.toString();
}

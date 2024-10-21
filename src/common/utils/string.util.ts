export function getShortName(name: string = 'A'): string {
  const words = name.split(' ').slice(0, 2);
  const initials = words.map(word => word[0].toUpperCase()).join('');

  return initials;
}

export function convertBytes(byte: number): string {
  const kiloByte: number = byte / 1024;
  const megaByte: number = kiloByte / 1024;
  const gigaByte: number = megaByte / 1024;

  if (gigaByte >= 1) {
    return `${gigaByte.toFixed(2)} GB`;
  } else if (megaByte >= 1) {
    return `${megaByte.toFixed(2)} MB`;
  } else if (kiloByte >= 1) {
    return `${kiloByte.toFixed(2)} KB`;
  } else {
    return `${byte} bytes`;
  }
}

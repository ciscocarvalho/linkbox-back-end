// https://dev.to/alisabaj/removing-an-element-in-an-array-in-place-2hb7#comment-105cf
export const removeItemInPlace = <T>(array: T[], item: T) => {
  let i = array.indexOf(item);

  if (i === -1) {
    return;
  }

  while (i > -1) {
    array.splice(i, 1);
    i = array.indexOf(item, i);
  }
}

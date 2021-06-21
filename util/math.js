// generate range of integers
export const range = (start, end) =>
  [...Array(end - start).keys()].map((i) => i + start);

// trig funcs in degrees
export const sin = (degrees) => Math.sin(2 * Math.PI * (degrees / 360));
export const cos = (degrees) => Math.cos(2 * Math.PI * (degrees / 360));

// shuffle array
export const shuffle = (array) => {
  array = [...array];
  for (let index = array.length - 1; index > 0; index--) {
    const newIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[newIndex]] = [array[newIndex], array[index]];
  }
  return array;
};

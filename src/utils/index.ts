export function isUndef(val) {
  return typeof val === "undefined";
}
export function isNum(val) {
  return typeof val === "number";
}
export function removeFromArr(arr: any[], val: any) {
  const find = arr.findIndex((o) => o === val);
  find >= 0 && arr.splice(find, 1);
}

export function isUndef(val) {
  return typeof val === "undefined";
}
export function isNum(val) {
  return typeof val === "number";
}
export function isFn(val) {
  return typeof val === "function";
}
export function removeFromArr(arr: any[], val: any) {
  const find = arr.findIndex((o) => o === val);
  find >= 0 && arr.splice(find, 1);
}

export function loadImg(src, imgEl) {
  return new Promise<{ width: number; height: number; el: HTMLImageElement }>(
    (resolve) => {
      imgEl = imgEl || new Image();
      imgEl.onload = () => {
        resolve({
          width: imgEl.naturalWidth,
          height: imgEl.naturalHeight,
          el: imgEl,
        });
      };
      imgEl.src = src;
    }
  );
}

export function limit(val: number, min: number, max: number) {
  if (max < min) {
    throw new Error(`invalid params，min:${min},max:${max}`);
  }
  return Math.max(min, Math.min(max, val));
}

export function def<T>(target: T, key: string, v: any) {
  Object.defineProperty(target, key, {
    get() {
      return v;
    },
    set(val) {
      v = val;
      return v;
    },
  });
  return target;
}

export function getType(obj: Object) {
  return Object.prototype.toString.call(obj);
}


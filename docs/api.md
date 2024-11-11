## EventDispatcher

```typescript
type EventHandlerArgs = {
  target: EventDispatcher;
  data?: any;
};
type EventHandler = (e: EventHandlerArgs) => void;
```

| 名称   | 说明                                                     | 类型                                              | 默认值 |
| ------ | -------------------------------------------------------- | ------------------------------------------------- | ------ |
| on     | 监听事件                                                 | `(event: string, handler: EventHandler) => void`  |
| off    | 取消监听，若 handler 为空， <br/> 则取消该类型所有监听器 | `(event: string, handler?: EventHandler) => void` |
| offAll | 取消所有监听                                             | `() => void`                                      |
| emit   | 派发事件                                                 | `emit(event:string, data?:any) => void`           |

## DisplayObject

显示对象

```typescript
class DisplayObject extends EventDispatcher { ... }
```

#### 属性

| 名称        | 说明                                | 类型                     | 默认值  |
| ----------- | ----------------------------------- | ------------------------ | ------- |
| x           | 水平坐标                            | `number`                 | `0`     |
| y           | 垂直坐标                            | `number`                 | `0`     |
| width       | 宽度                                | `number`                 | `0`     |
| height      | 高度                                | `number`                 | `0`     |
| alpha       | 透明度，范围 0~1                    | `number`                 | `1`     |
| scaleX      | 水平缩放                            | `number`                 | `1`     |
| scaleY      | 垂直缩放                            | `number`                 | `1`     |
| skewX       | 水平倾斜                            | `number`                 | `1`     |
| skewY       | 垂直倾斜                            | `number`                 | `1`     |
| pivotX      | 水平锚点                            | `number`                 | `0`     |
| pivotY      | 垂直锚点                            | `number`                 | `0`     |
| stage       | 舞台                                | `Stage`                  | `null`  |
| parent      | 父容器                              | `DisplayObjectContainer` | `null`  |
| mouseEnable | 启用交互                            | `boolean`                | `false` |
| bitmapCache | 开启位图缓存                        | `boolean`                | `false` |
| snapToPixel | 像素对齐                            | `boolean`                | `false` |
| graphics    | 画笔，参考 [Graphics](api/graphics) | `Graphics`               |

#### 方法

| 名称          | 说明                 | 类型                             | 默认值 |
| ------------- | -------------------- | -------------------------------- | ------ |
| hitTestObject | 与矩形对象的碰撞检测 | `(obj:DisplayObject) => boolean` |
| hitTestPoint  | 与点的碰撞检测       | `(x:number,y:number) => boolean` |

## DisplayObjectContainer

容器

```typescript
class DisplayObjectContainer extends DisplayObject { ... }
```

#### 属性

| 名称     | 说明   | 类型              | 默认值 |
| -------- | ------ | ----------------- | ------ |
| children | 子节点 | `DisplayObject[]` | `[]`   |

#### 方法

| 名称          | 说明                 | 类型                                                  |
| ------------- | -------------------- | ----------------------------------------------------- |
| addChild      | 添加子元素           | `(child:DisplayObject) => void`                       |
| addChildAt    | 添加子元素到指定层级 | `(child:DisplayObject,index:number) => void`          |
| removeChild   | 移除子元素           | `(child:DisplayObject) => void`                       |
| removeChildAt | 移除指定位置的子元素 | `(child:DisplayObject,index:number) => void`          |
| swapChild     | 交换子元素位置       | `(childA:DisplayObject,childB:DisplayObject) => void` |

## Stage

```typescript
class Stage extends DisplayObjectContainer {
  constructor(el: HTMLCanvasElement | string, dpr?: number) { ... }
}
```

- el canvas 节点或者 css 选择器
- dpr 像素比，通常取值`window.devicePixelRatio`

#### 属性

| 名称   | 说明     | 类型                | 默认值 |
| ------ | -------- | ------------------- | ------ |
| fps    | 帧率     | `number`            | `60`   |
| canvas | 画布节点 | `HtmlCanvasElement` |

#### 方法

| 名称      | 说明                                       | 类型                                                  |
| --------- | ------------------------------------------ | ----------------------------------------------------- |
| addCanvas | 添加 canvas 节点，通常用于绘制到多个画布上 | `type addCanvas = (canvas: HTMLCanvasElement) => void`


## Sprite

```typescript

class Sprite extends DisplayObjectContainer { ... }

```

## Bitmap

```typescript

class Bitmap extends DisplayObject {
    constructor(src:string){ ... }
}
```

#### 属性

- src

  图片地址

## MovieClip

```typescript

type ClipItem = {
  w: number;
  h: number;
  x: number;
  y: number;
};

class MovieClip extends DisplayObject { ... }

```

#### 属性

- fps

  帧率，默认 12

- loop

  是否循环播放

#### 方法

```typescript
type ClipItem = {
  w: number;
  h: number;
  x: number;
  y: number;
};
```

- play

  播放动画

  ```typescript
  type play = () => void;
  ```

- pause

  暂停动画

  ```typescript
  type pause = () => void;
  ```

- gotoAndStop

  跳转到指定帧并暂停

  ```typescript
  type gotoAndStop = (index: number) => void;
  ```

- gotoAndPlay

  跳转到指定帧并播放

  ```typescript
  type gotoAndPlay = (index: number) => void;
  ```

- addClip

  添加帧

  ```typescript
  type addClip = (clip: ClipItem) => void;
  ```

- addClipAt

  在指定位置添加帧

  ```typescript
  type addClipAt = (clip: ClipItem, index: number) => void;
  ```

- removeClip

  移除帧

  ```typescript
  type removeClipAt = (index: number) => void;
  ```

- setClips

  设置序列帧

  ```typescript
  type removeClipAt = (clips: ClipItem[]) => void;
  ```

## EventDispatcher

```typescript
type EventHandlerArgs = {
  target: EventDispatcher;
  data?: any;
};
type EventHandler = (e: EventHandlerArgs) => void;
```

#### 方法

- on

  `on(event: string, handler: EventHandler): void`

  监听事件

  > - `event` 事件类型
  > - `handler` 事件处理器

* off

`off(event?:string, handler?: EventHandler) => void`

> 取消监听

- `event` 事件类型，不传则取消所有事件处理器
- `handler` 事件处理器，不传则取消 event 下所有的处理器

- emit

`emit(event:string, data?:any)`

> 派发事件

- event 事件类型
- data 事件参数

## DisplayObject

显示对象

```typescript
class DisplayObject extends EventDispatcher { ... }
```

#### 属性

- x

  横坐标

  `target.x=100`

- y

  纵坐标

  `target.y=100`

- width

  宽度

  `target.width=100`

- height

  高度

  `target.height=100`

- alpha
  透明度，范围 0~1

  `target.alpha=.5`

- scaleX

  x 轴上缩放值

- scaleY

  y 轴上缩放值

- skewX

  x 轴上倾斜值

- skewY

  y 轴上缩放值

- pivotX

  水平锚点，范围 0~1

- pivotY

  垂直锚点，范围 0~1

- stage

  指向舞台的指针

- parent

  父容器

- mouseEnable

  是否启用交互事件，启用后才会接受事件


- bitmapCache

  是否启用位图缓存

- snapToPixel

  绘制时是否进行像素对齐

- graphics

  画笔，参考 [Graphics](api/graphics)

  ```typescript
  public graphics: Graphics;
  ```

#### 方法

- hitTestObject
- hitTestPoint



## DisplayObjectContainer

容器

```typescript
class DisplayObjectContainer extends DisplayObject { ... }
```

#### 属性

- children
  子节点

#### 方法

- addChild

  ```typescript
  type addChild = (child: DisplayObject) => void;
  ```

  添加子元素

  > - child 要添加的元素

- addChildAt

  ```typescript
  type addChildAt = (child: DisplayObject, index: number) => void;
  ```

  添加子元素到指定层级

  > - child 要添加的元素
  > - index 位置

- removeChild

  ```typescript
  type removeChild = (child: DisplayObject) => void;
  ```

  移除子元素

  > - child 要移除的元素

- removeChildAt

  ```typescript
  type removeChildAt = (index: number) => void;
  ```

  移除指定位置的子元素

  > - index 要移除的元素索引

- swapChild

  ```typescript
  type swapChild = (a: DisplayObject, b: DisplayObject) => void;
  ```

  交换子元素位置

  > - a 元素 a
  > - b 元素 b

## Stage

```typescript
class Stage extends DisplayObjectContainer {
  constructor(el: HTMLCanvasElement | string, dpr?: number) { ... }
}
```

- el canvas 节点或者 css 选择器
- dpr 像素比，通常取值`window.devicePixelRatio`

#### 属性

- fps

  帧率，默认 60

- canvas

  绘制的 canvas 的 dom 节点

#### 方法

- addCanvas

  添加 canvas 节点，通常用于绘制到多个画布上

  ```typescript
  type addCanvas = (canvas: HTMLCanvasElement) => void;
  ```

  - canvas canvas dom

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

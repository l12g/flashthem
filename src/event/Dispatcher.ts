import { EventHandler } from "../../type";

export default class EventDispatcher {
  private _map: Map<String, Set<EventHandler>>;
  public addEventListener(type: string, handler: EventHandler) {
    const map = this._map || (this._map = new Map());
    if (!map.has(type)) {
      map.set(type, new Set());
    }
    map.get(type).add(handler);
  }
  public removeEventListener(type: string, handler: EventHandler) {
    const map = this._map;
    if (!map || !map.has(type)) {
      return;
    }
    map.get(type).delete(handler);
  }
  public removeAllEventListerner(type?: string) {
    const map = this._map;
    if (!map || !map.has(type)) {
      return;
    }
    type ? map.get(type).clear() : map.clear();
  }
  public emit(type: string, data?: any) {
    const map = this._map;
    if (!map || !map.has(type)) {
      return;
    }
    for (const handler of map.get(type).values()) {
      handler({
        target: this,
        data,
      });
    }
  }
}

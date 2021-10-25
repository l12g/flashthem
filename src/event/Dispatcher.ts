import { EventHandler } from "../../type";

export default class EventDispatcher {
  private _map: Map<String, Set<EventHandler>> = new Map();
  public on(type: string, handler: EventHandler) {
    const map = this._map;
    if (!map.has(type)) {
      map.set(type, new Set());
    }
    map.get(type).add(handler);
  }
  public off(type: string, handler: EventHandler) {
    const map = this._map;
    map.get(type)?.delete(handler);
  }
  public offAll(type?: string) {
    const map = this._map;
    type ? map.get(type)?.clear() : map.clear();
  }
  public emit(type: string, data?: any) {
    const map = this._map;
    if (!map.has(type)) {
      return;
    }
    for (const handler of map.get(type).values()) {
      handler({
        target: this,
        data,
      });
    }
  }
  public dispose() {
    this.offAll();
    this._map.clear();
  }
}

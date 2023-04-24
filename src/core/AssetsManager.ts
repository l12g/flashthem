import EventDispatcher from "../event/Dispatcher";

type Asset = { url: string; alias: string };
class AssetsManager extends EventDispatcher {
  private _loadedAssets: Map<string, Asset> = new Map();
  private _assets: Asset[] = [];
  private _status: "loading" | "done" | "init" = "init";
  add(asset: string | Asset) {
    const raw =
      typeof asset === "string" ? { url: asset, alias: asset } : asset;
    this._assets.push(raw);
    this.load();
  }

  private load() {
    if (this._status === "loading") {
      return;
    }
    this._status = "loading";
    const fn = () => {
      const first = this._assets.shift();
      if (!first) {
        this._status = "done";
        this.emit("load");
        return;
      }
      fn();
    };
    fn();
  }
}

export default new AssetsManager();

import EventDispatcher from "./src/event/Dispatcher";

declare interface EventHandlerArgs {
  target: EventDispatcher;
  data?: any;
}
declare interface EventHandler {
  (args: EventHandlerArgs): void;
}

interface cEnum extends Array<string> {
  r: string;
  o: string;
  y: string;
  g: string;
  b: string;
  p: string;
}
d; /* eclare class Actor {
  s: Sprite;
  parentNode: ServerNode;
  pId: string;
  id: string;
  name: string;
  type: number;
  timeSinceLastMessage: number;
  sendMessage(target: Actor, type: number): void;
  postMessage(type: number): void;
}
declare interface ServerNode {
  constructor(p5: p5, mainType: number, blockedTypes: number[]);
  constructor(p5: p5, id: string);
  s: Sprite;
  id: string;
  blockedTypes: number[];
  mainType: number;
  members: Actor[];
  content: Message[];
  selected: boolean;
}
declare interface Message {
  s: Sprite;
  id: string;
  direct: boolean;
  source: Actor;
  sId: string;
  sourceType: number;
  target: Actor | ServerNode;
  tId: string;
  targetType: number;
  parent: ServerNode;
  pId: string;
  destroyed: boolean;
} */
declare namespace p5 {
  interface Element {
    option: (a: any, b: any) => void;
    parent: (a: any) => void;
    public style(att: string, val: string): p5.Element;
  }
  function _decrementPreload(): void;
}
declare interface p5 {
  _decrementPreload(): void;
}
declare function createInput(...args: any): p5.Element;
declare function drawSprite(sprite: Sprite): void;

declare interface HTMLCanvasElement {
  public parent(p: string): void;
}

interface cEnum extends Array<string> {
  r: string;
  o: string;
  y: string;
  g: string;
  b: string;
  p: string;
}
interface Actor {
  constructor(p5: any): void;
  s: Sprite;
  parentNode: ServerNode;
  id: string;
  name: string;
  type: number;
  timeSinceLastMessage: number;
  sendMessage(target: Actor, type: number): void;
  postMessage(type: number): void;
}
interface ServerNode {
  s: Sprite;
  id: string;
  blockedTypes: number[];
  mainType: number;
  members: Actor[];
  content: Message[];
  selected: boolean;
}
interface Message {
  s: Sprite;
  id: string;
  direct: boolean;
  source: Actor;
  sourceType: number;
  target: Actor | ServerNode;
  targetType: number;
  parent: ServerNode;
  destroyed: boolean;
}
interface Element {
  option: () => void;
}

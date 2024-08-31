interface PositionInterface {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export type Position = PositionInterface | null;

export enum BlockType {
  Text = "TEXT",
  Header = "HEADER",
  Image = "IMAGE",
  AI = "AI",
}

interface BlockInfoBase {
  type: BlockType;
  text: string;
  generating?: boolean;
  addingText?: { char: string; key: string }[];
  regenPrompt?: string;
  imgUrl: string | null;
  attemptLoad: boolean;
  key: string;
  moving: boolean;
  position: Position;
  // previewIndex: number | null;
}

export interface BlockInfoStatic extends BlockInfoBase {
  moving: false;
  position: null;
  // previewIndex: null;
}

export interface BlockInfoMoving extends BlockInfoBase {
  moving: true;
  position: Exclude<Position, null>;
  // previewIndex: number;
}

export type BlockInfo = BlockInfoStatic | BlockInfoMoving;

interface BlockGroupInfoBase {
  // export interface BlockGroupInfo {
  blocks: BlockInfo[];
  colorIndex: number;
  key: string;
  moving: boolean;
  position: Position;
  previewIndex: number | null;
}

export interface BlockGroupInfoStatic extends BlockGroupInfoBase {
  moving: false;
  position: null;
  previewIndex: null;
}

export interface BlockGroupInfoMoving extends BlockGroupInfoBase {
  moving: true;
  position: Exclude<Position, null>;
  previewIndex: number;
}

export type BlockGroupInfo = BlockGroupInfoStatic | BlockGroupInfoMoving;

export interface FullBlockIndex {
  blockGroupIndex: number;
  blockIndex: number;
}

export interface Tab {
  id: string;
  name: string;
  current: boolean;
  blockGroups: BlockGroupInfo[];
}

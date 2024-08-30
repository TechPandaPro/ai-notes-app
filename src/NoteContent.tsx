import { useEffect, useState } from "react";
import { Position } from "./BlockGroupMarker";
import BlockGroup from "./BlockGroup";
import { BlockType } from "./BlockTypeOption";
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";

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

// TODO: consider using immer for blocks state
// https://github.com/immerjs/use-immer

// TODO: ADD API KEY TO ELECTRON STORE
const apiKey = "";

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export default function NoteContent() {
  const [blockGroups, setBlockGroups] = useState<BlockGroupInfo[]>([
    {
      blocks: [
        {
          type: BlockType.Header,
          text: "Welcome to the AI Notes app!",
          imgUrl: null,
          attemptLoad: false,
          key: `${Date.now()}_0`,
          moving: false,
          position: null,
        },
      ],
      colorIndex: 0,
      key: `${Date.now()}_0`,
      moving: false,
      position: null,
      previewIndex: null,
    },
    {
      blocks: [
        {
          type: BlockType.Text,
          text: "you can type in each of these blocks!",
          imgUrl: null,
          attemptLoad: false,
          key: `${Date.now()}_1`,
          moving: false,
          position: null,
        },
        {
          type: BlockType.Text,
          text: "each row has its own set of blocks!",
          imgUrl: null,
          attemptLoad: false,
          key: `${Date.now()}_2`,
          moving: false,
          position: null,
        },
      ],
      colorIndex: 0,
      key: `${Date.now()}_1`,
      moving: false,
      position: null,
      previewIndex: null,
    },
    {
      blocks: [
        {
          type: BlockType.Text,
          text: "you can add images to blocks, too!",
          imgUrl: null,
          attemptLoad: false,
          key: `${Date.now()}_0`,
          moving: false,
          position: null,
        },
        {
          type: BlockType.AI,
          text: "[add an image here]",
          imgUrl: null,
          attemptLoad: false,
          key: `${Date.now()}_1`,
          moving: false,
          position: null,
        },
      ],
      colorIndex: 0,
      key: `${Date.now()}_2`,
      moving: false,
      position: null,
      previewIndex: null,
    },
  ]);
  const [colorPickerIsOpen, setColorPickerIsOpen] = useState<boolean>(false);
  const [focusIndex, setFocusIndex] = useState<FullBlockIndex | null>(null);
  const [previewIndex, setPreviewIndex] = useState<FullBlockIndex | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  function handleTypeUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    type: BlockType
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks[blockIndex].type = type;
    if (type === BlockType.Image)
      nextBlockGroup.blocks[blockIndex].attemptLoad = true;
    setBlockGroups(nextBlockGroups);
    setFocusIndex({ blockGroupIndex, blockIndex });
    console.log({ blockGroupIndex, blockIndex });
  }

  function handleTextUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    newText: string
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    const nextBlock = { ...nextBlockGroup.blocks[blockIndex] };
    nextBlockGroup.blocks[blockIndex] = nextBlock;
    if (nextBlock.type === BlockType.Image) {
      nextBlock.type = BlockType.Text;
      nextBlock.imgUrl = null;
    }
    nextBlock.text = newText;
    setBlockGroups(nextBlockGroups);
  }

  function handleImageUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    imgUrl: string | null
  ) {
    if (blockGroups[blockGroupIndex].blocks[blockIndex].text.length >= 1)
      return;
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    const nextBlock = { ...nextBlockGroup.blocks[blockIndex] };
    nextBlockGroup.blocks[blockIndex] = nextBlock;
    nextBlock.type = BlockType.Image;
    nextBlock.imgUrl = imgUrl;
    setBlockGroups(nextBlockGroups);
  }

  function handleAttemptLoadUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    attemptLoad: boolean
  ) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks[blockIndex].attemptLoad = attemptLoad;
    setBlockGroups(nextBlockGroups);
  }

  function handleSetFocus(
    blockGroupIndex: number,
    blockIndex: number,
    isFocused: boolean
  ) {
    if (isFocused) setFocusIndex({ blockGroupIndex, blockIndex });
    else if (
      focusIndex && // for type checking
      blockGroupIndex === focusIndex.blockGroupIndex &&
      blockIndex === focusIndex.blockIndex
    )
      setFocusIndex(null);
  }

  // function handleSetFocus(
  //   blockGroupIndex: number,
  //   blockIndex: number,
  //   isFocused: boolean
  // ) {
  //   // if (isFocused) setFocusIndex({ blockGroupIndex, blockIndex });
  //   // else if (
  //   //   focusIndex && // for type checking
  //   //   blockGroupIndex === focusIndex.blockGroupIndex &&
  //   //   blockIndex === focusIndex.blockIndex
  //   // )
  //   //   setFocusIndex(null);
  //   setFocus(blockGroupIndex, blockIndex, isFocused);
  //   console.log(isFocused);
  //   if (!isFocused || blockGroupIndex !== currOpenColorPicker)
  //     setCurrOpenColorPicker(null);
  // }

  // FIXME: it's impossible to open the picker with this version of the function
  // function handleSetFocus(
  //   blockGroupIndex: number,
  //   blockIndex: number,
  //   isFocused: boolean
  // ) {
  //   let nextFocusIndex;

  //   if (isFocused) nextFocusIndex = { blockGroupIndex, blockIndex };
  //   else if (
  //     focusIndex && // for type checking
  //     blockGroupIndex === focusIndex.blockGroupIndex &&
  //     blockIndex === focusIndex.blockIndex
  //   )
  //     nextFocusIndex = null;

  //   if (nextFocusIndex !== undefined) {
  //     if (nextFocusIndex?.blockGroupIndex !== currOpenColorPicker)
  //       setCurrOpenColorPicker(null);
  //     setFocusIndex(nextFocusIndex);
  //   }
  // }

  // function handleOpenColorPicker(blockGroupIndex: number) {
  function handleOpenColorPicker(open: boolean) {
    setColorPickerIsOpen(open);
    // setCurrOpenColorPicker(blockGroupIndex);
    // if (focusIndex === null || focusIndex.blockGroupIndex !== blockGroupIndex)
    //   setFocus(blockGroupIndex, 0, true);
  }

  // function setFocus(
  //   blockGroupIndex: number,
  //   blockIndex: number,
  //   isFocused: boolean
  // ) {
  //   if (isFocused) setFocusIndex({ blockGroupIndex, blockIndex });
  //   else if (
  //     focusIndex && // for type checking
  //     blockGroupIndex === focusIndex.blockGroupIndex &&
  //     blockIndex === focusIndex.blockIndex
  //   )
  //     setFocusIndex(null);
  // }

  function handleSelectColor(blockGroupIndex: number, colorIndex: number) {
    const nextBlockGroups = blockGroups.slice();

    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;

    nextBlockGroup.colorIndex = colorIndex;

    setBlockGroups(nextBlockGroups);
  }

  // function handleSetMoving(
  //   blockGroupIndex: number,
  //   blockIndex: number,
  //   isMoving: boolean
  // ) {
  //   const nextBlockGroups = blockGroups.slice();
  //   const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
  //   nextBlockGroups[blockGroupIndex] = nextBlockGroup;
  //   nextBlockGroup.blocks[blockIndex].moving = isMoving;
  //   setBlockGroups(nextBlockGroups);
  // }

  function handleAddBlock(blockGroupIndex: number, createAtIndex: number) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    nextBlockGroup.blocks.splice(createAtIndex, 0, {
      type: BlockType.Text,
      text: "",
      imgUrl: null,
      attemptLoad: false,
      key: generateKey(nextBlockGroup.blocks),
      moving: false,
      position: null,
    });
    setBlockGroups(nextBlockGroups);
    setFocusIndex({ blockGroupIndex, blockIndex: createAtIndex });
  }

  // TODO: blur block group if block is currently focused
  function handleDeleteBlock(blockGroupIndex: number, deleteIndex: number) {
    const nextBlockGroups = blockGroups.slice();

    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;

    const nextBlocks = nextBlockGroup.blocks.slice();
    nextBlockGroup.blocks = nextBlocks;

    // if (
    //   focusIndex &&
    //   focusIndex.blockGroupIndex === blockGroupIndex &&
    //   focusIndex.blockIndex === nextBlocks.length - 1
    // )
    //   setFocusIndex({
    //     blockGroupIndex: focusIndex.blockGroupIndex,
    //     blockIndex: focusIndex.blockIndex - 1,
    //   });

    nextBlocks.splice(deleteIndex, 1);

    if (nextBlockGroup.blocks.length === 0)
      nextBlockGroups.splice(blockGroupIndex, 1);

    if (nextBlockGroups.length === 0) {
      const newBlockGroup: BlockGroupInfo = {
        blocks: [],
        colorIndex: 0,
        key: generateKey(blockGroups),
        moving: false,
        position: null,
        previewIndex: null,
      };
      newBlockGroup.blocks.push({
        type: BlockType.Text,
        text: "",
        imgUrl: null,
        attemptLoad: false,
        key: generateKey(newBlockGroup.blocks),
        moving: false,
        position: null,
      });
      nextBlockGroups.push(newBlockGroup);
    }

    setBlockGroups(nextBlockGroups);

    if (
      focusIndex &&
      focusIndex.blockGroupIndex === blockGroupIndex &&
      focusIndex.blockIndex === deleteIndex
    )
      setFocusIndex(null);
  }

  function handleAddBlockGroup(createAtIndex: number) {
    setFocusIndex({ blockGroupIndex: createAtIndex, blockIndex: 0 });

    const newBlockGroup: BlockGroupInfo = {
      blocks: [],
      colorIndex: 0,
      key: generateKey(blockGroups),
      moving: false,
      position: null,
      previewIndex: null,
    };
    newBlockGroup.blocks.push({
      type: BlockType.Text,
      text: "",
      imgUrl: null,
      attemptLoad: false,
      key: generateKey(newBlockGroup.blocks),
      moving: false,
      position: null,
    });

    const nextBlockGroups = blockGroups.slice();
    nextBlockGroups.splice(createAtIndex, 0, newBlockGroup);

    setBlockGroups(nextBlockGroups);
  }

  // function handleBlockMove(
  //   blockGroupIndex: number,
  //   blockIndex: number,
  //   position: Position
  // ) {
  //   const nextBlockGroups = blockGroups.slice();
  //   const blockGroup = nextBlockGroups[blockGroupIndex];
  //   const nextBlock = { ...blockGroup.blocks[blockIndex] };
  //   blockGroup.blocks[blockIndex] = nextBlock;
  //   if (position) {
  //     nextBlock.moving = true;
  //     nextBlock.position = position;
  //   } else {
  //     nextBlock.moving = false;
  //     nextBlock.position = null;
  //     if (
  //       previewIndex !== null &&
  //       nextBlockGroups[previewIndex.blockGroupIndex].blocks.length + 1 <= 5
  //     ) {
  //       // add block to group
  //     }
  //   }
  //   setBlockGroups(nextBlockGroups);
  // }

  function handleBlockMove(
    blockGroupIndex: number,
    blockIndex: number,
    position: Position
  ) {
    const nextBlockGroups = blockGroups.slice();
    const blockGroup = nextBlockGroups[blockGroupIndex];
    const nextBlock = { ...blockGroup.blocks[blockIndex] };
    blockGroup.blocks[blockIndex] = nextBlock;
    if (position) {
      nextBlock.moving = true;
      nextBlock.position = position;
    } else {
      nextBlock.moving = false;
      nextBlock.position = null;
    }
    setBlockGroups(nextBlockGroups);
  }

  function handleBlockGroupMove(blockGroupIndex: number, position: Position) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;
    if (position) {
      nextBlockGroup.moving = true;
      nextBlockGroup.position = position;
    } else {
      nextBlockGroup.moving = false;
      nextBlockGroup.position = null;
      if (
        previewIndex !== null &&
        nextBlockGroups[previewIndex.blockGroupIndex].blocks.length +
          nextBlockGroup.blocks.length <=
          5
      ) {
        const nextPreviewedBlock = {
          ...nextBlockGroups[previewIndex.blockGroupIndex],
        };
        nextPreviewedBlock.blocks.splice(
          previewIndex.blockIndex,
          0,
          ...nextBlockGroup.blocks
        );
        nextBlockGroups.splice(blockGroupIndex, 1);
        for (const text of nextBlockGroup.blocks)
          text.key = generateKey(nextPreviewedBlock.blocks);
        setPreviewIndex(null);
      }
    }
    setBlockGroups(nextBlockGroups);
  }

  function handleBlockGroupCancelMove(blockGroupIndex: number) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;

    nextBlockGroup.moving = false;
    nextBlockGroup.position = null;
    // if (
    //   previewIndex !== null &&
    //   nextBlockGroups[previewIndex.blockGroupIndex].blocks.length +
    //     nextBlockGroup.blocks.length <=
    //     5
    // ) {
    //   const nextPreviewedBlock = {
    //     ...nextBlockGroups[previewIndex.blockGroupIndex],
    //   };
    //   nextPreviewedBlock.blocks.splice(
    //     previewIndex.blockIndex,
    //     0,
    //     ...nextBlockGroup.blocks
    //   );
    //   nextBlockGroups.splice(blockGroupIndex, 1);
    //   for (const text of nextBlockGroup.blocks)
    //     text.key = generateBlockKey(nextPreviewedBlock.blocks);
    //   setPreviewIndex(null);
    // }
    setPreviewIndex(null);

    setBlockGroups(nextBlockGroups);
  }

  function handleMovingBlockUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    movedToBlockGroupIndex: number,
    movedToBlockIndex: number
  ) {
    const nextBlockGroups = blockGroups.slice();
    const blockFromGroup = nextBlockGroups[blockGroupIndex];
    // nextBlockGroups[blockGroupIndex] = blockFromGroup;
    const blockToGroup = nextBlockGroups[movedToBlockGroupIndex];
    // nextBlockGroups[movedToBlockGroupIndex] = blockToGroup;

    blockToGroup.blocks.splice(
      movedToBlockIndex,
      0,
      blockFromGroup.blocks.splice(blockIndex, 1)[0]
    );
    blockToGroup.blocks[movedToBlockIndex].key = generateKey(
      blockToGroup.blocks
    );

    if (blockFromGroup.blocks.length === 0)
      nextBlockGroups.splice(blockGroupIndex, 1);

    // if (blockGroupIndex === movedToBlockGroupIndex) {
    //   blockToGroup.blocks.splice(
    //     movedToBlockIndex,
    //     0,
    //     blockFromGroup.blocks.splice(blockIndex, 1)[0]
    //   );
    //   blockToGroup.blocks[movedToBlockIndex].key = generateBlockKey(
    //     blockToGroup.blocks
    //   );
    // } else {
    //   blockToGroup.blocks.splice(
    //     movedToBlockIndex,
    //     0,
    //     blockFromGroup.blocks[blockIndex]
    //   );
    //   blockToGroup.blocks[movedToBlockIndex].key = generateBlockKey(
    //     blockToGroup.blocks
    //   );

    //   blockFromGroup.blocks.splice(blockIndex, 1);
    // }

    setBlockGroups(nextBlockGroups);

    // nextBlockGroup.blocks.splice(createAtIndex, 0, {
    //   type: BlockType.Text,
    //   text: "",
    //   key: generateBlockKey(nextBlockGroup.blocks),
    //   moving: false,
    //   position: null,
    // });
    // setBlockGroups(nextBlockGroups);
    // setFocusIndex({ blockGroupIndex, blockIndex: createAtIndex });

    console.table({
      blockGroupIndex,
      blockIndex,
      movedToBlockGroupIndex,
      movedToBlockIndex,
    });
  }

  function handlePreviewIndexUpdate(
    blockGroupIndex: number,
    blockIndex: number | null
  ) {
    // console.log({ blockGroupIndex, blockIndex });
    if (blockIndex !== null) setPreviewIndex({ blockGroupIndex, blockIndex });
    else if (previewIndex && blockGroupIndex === previewIndex?.blockGroupIndex)
      setPreviewIndex(null);
  }

  function handlePromptUpdate(
    blockGroupIndex: number,
    blockIndex: number,
    newPrompt: string
  ) {
    const nextBlockGroups = blockGroups.slice();

    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;

    const nextBlocks = nextBlockGroup.blocks.slice();
    nextBlockGroup.blocks = nextBlocks;

    const nextBlock = { ...nextBlocks[blockIndex] };
    nextBlocks[blockIndex] = nextBlock;

    nextBlock.regenPrompt = newPrompt;

    setBlockGroups(nextBlockGroups);
  }

  async function handleQueryAi(
    blockGroupIndex: number,
    regenOptions?: { lastResponse: string; prompt: string }
  ) {
    const { blocks } = blockGroups[blockGroupIndex];

    const added = addAiBlock(blockGroupIndex);

    if (!added) return;

    console.log(blocks);

    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content: `You will be provided multiple sections of "thoughts" from the user's notes. You should provide your opinion and insight on what the user has written.

Refrain from including greetings, as this is not a conversation with the user. This is an exchange of thought, with no social aspect.

Though you are encouraged to share thoughts, you should be concise. Verbose responses are unnecessary and discouraged.

${
  regenOptions
    ? `The user has requested that you regenerate your response. Your previous response is provided below. Your new response should be different than your prior response.

Previous response: """${regenOptions.lastResponse}"""

Prompt: """${regenOptions.prompt || "None"}"""`
    : ""
}`,
    };

    const userMessages: ChatCompletionUserMessageParam[] = blocks.map(
      (block) => ({
        role: "user",
        content: [
          block.type === BlockType.Image && block.imgUrl
            ? { type: "image_url", image_url: { url: block.imgUrl } }
            : { type: "text", text: block.text },
        ],
      })
    );

    const messages: ChatCompletionMessageParam[] = [
      systemMessage,
      ...userMessages,
    ];

    console.log(JSON.stringify(messages, null, 2));

    // console.log(messages);

    // console.log(apiKey);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.choices[0].finish_reason) {
        const blockGroup = blockGroups[blockGroupIndex];
        const aiBlockIndex = getAiBlockIndex(blockGroupIndex);
        blockGroup.blocks[aiBlockIndex].generating = false;
        break;
      } else {
        const content = chunk.choices[0]?.delta?.content ?? "";
        if (content) addAiBlockChar(blockGroupIndex, content);
      }
    }
  }

  // function addAiBlock(blockGroupIndex: number): boolean {
  //   const nextBlockGroups = blockGroups.slice();
  //   const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
  //   nextBlockGroups[blockGroupIndex] = nextBlockGroup;

  //   // const blockIndex = nextBlockGroup.blocks.findIndex(
  //   //   (b) => b.type === BlockType.AI
  //   // );

  //   // if (blockIndex !== -1) return false;

  //   if (nextBlockGroup.blocks.some((b) => b.type === BlockType.AI))
  //     return false;

  //   const createAtIndex = nextBlockGroup.blocks.length;
  //   nextBlockGroup.blocks.splice(createAtIndex, 0, {
  //     type: BlockType.AI,
  //     text: "",
  //     addingText: [],
  //     imgUrl: null,
  //     attemptLoad: false,
  //     key: generateKey(nextBlockGroup.blocks),
  //     moving: false,
  //     position: null,
  //   });

  //   setBlockGroups(nextBlockGroups);

  //   return true;
  // }

  function addAiBlock(blockGroupIndex: number): boolean {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;

    // const blockIndex = nextBlockGroup.blocks.findIndex(
    //   (b) => b.type === BlockType.AI
    // );

    const blockIndex = getAiBlockIndex(blockGroupIndex);

    let nextBlock: BlockInfo;

    if (blockIndex !== -1) {
      if (nextBlockGroup.blocks[blockIndex].generating) return false;
      nextBlock = { ...nextBlockGroup.blocks[blockIndex] };
      nextBlockGroup.blocks[blockIndex] = nextBlock;
    } else {
      const createAtIndex = nextBlockGroup.blocks.length;
      nextBlock = {
        type: BlockType.AI,
        text: "",
        generating: true,
        addingText: [],
        imgUrl: null,
        attemptLoad: false,
        key: generateKey(nextBlockGroup.blocks),
        moving: false,
        position: null,
      };
      nextBlockGroup.blocks.splice(createAtIndex, 0, nextBlock);
    }

    nextBlock.generating = true;
    nextBlock.addingText = [];
    nextBlock.regenPrompt = "";
    nextBlock.text = "";

    setBlockGroups(nextBlockGroups);

    return true;
  }

  function addAiBlockChar(blockGroupIndex: number, char: string) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;

    // const blockIndex = nextBlockGroup.blocks.findIndex(
    //   (b) => b.type === BlockType.AI
    // );

    const blockIndex = getAiBlockIndex(blockGroupIndex);

    let nextBlock: BlockInfo;

    if (blockIndex !== -1) {
      // console.log("exists!");
      nextBlock = { ...nextBlockGroup.blocks[blockIndex] };
      nextBlockGroup.blocks[blockIndex] = nextBlock;
    } else {
      throw new Error("Block does not exist");
      // console.log("does not exist!");
      // const createAtIndex = nextBlockGroup.blocks.length;
      // nextBlock = {
      //   type: BlockType.AI,
      //   text: "",
      //   addingText: [],
      //   imgUrl: null,
      //   attemptLoad: false,
      //   key: generateKey(nextBlockGroup.blocks),
      //   moving: false,
      //   position: null,
      // };
      // nextBlockGroup.blocks.splice(createAtIndex, 0, nextBlock);
    }

    // nextBlock.addingText = text ?? "";

    if (!nextBlock.generating) throw new Error("Block is not generating");

    if (!nextBlock.addingText) throw new Error("addingText not found");

    // if (nextBlock.addingText)
    nextBlock.addingText.push({
      char,
      key: generateKey(nextBlock.addingText),
    });

    setBlockGroups(nextBlockGroups);

    // console.log(nextBlock);

    // console.log("blocks:");
    // console.log(nextBlockGroup);
    // console.log(nextBlockGroup.blocks.length);
  }

  function getAiBlockIndex(blockGroupIndex: number) {
    const blockGroup = blockGroups[blockGroupIndex];
    const blockIndex = blockGroup.blocks.findIndex(
      (b) => b.type === BlockType.AI
    );
    return blockIndex;
  }

  function handleMergeChar(blockGroupIndex: number, key: string) {
    const nextBlockGroups = blockGroups.slice();
    const nextBlockGroup = { ...nextBlockGroups[blockGroupIndex] };
    nextBlockGroups[blockGroupIndex] = nextBlockGroup;

    const blockIndex = nextBlockGroup.blocks.findIndex(
      (b) => b.type === BlockType.AI
    );

    let nextBlock: BlockInfo;

    if (blockIndex !== -1) {
      nextBlock = { ...nextBlockGroup.blocks[blockIndex] };
      nextBlockGroup.blocks[blockIndex] = nextBlock;
    } else {
      throw new Error("Block does not exist");
      // const createAtIndex = nextBlockGroup.blocks.length;
      // nextBlock = {
      //   type: BlockType.AI,
      //   text: "",
      //   addingText: [],
      //   imgUrl: null,
      //   attemptLoad: false,
      //   key: generateKey(nextBlockGroup.blocks),
      //   moving: false,
      //   position: null,
      // };
      // nextBlockGroup.blocks.splice(createAtIndex, 0, nextBlock);
    }

    // nextBlock.addingText = text ?? "";

    // if (!nextBlock.addingText) nextBlock.addingText = [];

    // if (!nextBlock.generating) throw new Error("Block is not generating");

    if (!nextBlock.addingText) throw new Error("addingText not found");

    // if (nextBlock.addingText)
    // nextBlock.addingText.push({
    //   char,
    //   key: generateKey(nextBlock.addingText),
    // });

    const charIndex = nextBlock.addingText.findIndex(
      (char) => char.key === key
    );

    if (charIndex !== -1) {
      const char = nextBlock.addingText[charIndex];
      nextBlock.text += char.char;

      const nextAddingText = nextBlock.addingText.slice();
      nextBlock.addingText = nextAddingText;
      nextAddingText.splice(charIndex, 1);

      // if (nextAddingText.length === 0) delete nextBlock.addingText;

      setBlockGroups(nextBlockGroups);
    }
  }

  function generateKey(siblings: { key: string }[]) {
    const stamp = Date.now();
    const foundCount = siblings.filter(
      (sibling) => sibling.key && sibling.key.startsWith(`${stamp}_`)
    ).length;
    return `${stamp}_${foundCount}`;
  }

  // const currMovingBlock =
  //   blockGroups
  //     .find((blockGroup) => blockGroup.blocks.some((block) => block.moving))
  //     ?.blocks.find((block) => block.moving) ?? null;

  const currMovingBlockParent = blockGroups.find((blockGroup) =>
    blockGroup.blocks.some((block) => block.moving)
  );

  const currMovingBlock =
    currMovingBlockParent?.blocks.find((block) => block.moving) ?? null;

  // console.log("curr moving:");
  // console.log(currMovingBlock);

  const currMovingBlockGroup =
    blockGroups.find((blockGroup) => blockGroup.moving) ?? null;

  function handleKeyDown(e: KeyboardEvent) {
    // console.log("key pressed");
    if (
      e.key === "Escape" &&
      // !blockGroups.some((blockGroup) => blockGroup.moving)
      !currMovingBlock &&
      !currMovingBlockGroup
    ) {
      e.preventDefault();
      e.stopPropagation();
      console.log(focusIndex);
      if (focusIndex) {
        // console.log("received escape");
        setFocusIndex(null);
      } else {
        console.log("should set deleting");
        setIsDeleting(!isDeleting);
      }
    }
  }

  useEffect(() => {
    // console.log("key pressed down");
    // console.log(e.key);
    // console.log("add listener!");
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [blockGroups, focusIndex, isDeleting]);

  // console.log("curr: " + currOpenColorPicker);

  return (
    <div
      className={`noteContent ${
        // currMovingBlock || currMovingBlockGroup ? "moving" : ""
        currMovingBlockGroup || currMovingBlock ? "moving" : ""
      } ${isDeleting ? "deleting" : ""}`}
      // onKeyDown={handleKeyDown}
    >
      {blockGroups.map((blockGroup, blockGroupIndex) => (
        <BlockGroup
          key={blockGroup.key}
          blockGroupIndex={blockGroupIndex}
          blocks={blockGroup.blocks}
          colorIndex={blockGroup.colorIndex}
          focusBlockIndex={
            focusIndex && blockGroupIndex === focusIndex.blockGroupIndex
              ? focusIndex.blockIndex
              : null
          }
          colorPickerIsOpen={
            !!(
              focusIndex &&
              blockGroupIndex === focusIndex.blockGroupIndex &&
              colorPickerIsOpen
            )
          }
          // moving={blockGroup.moving}
          // position={blockGroup.position}
          {...(blockGroup.moving
            ? {
                moving: true as const,
                position: blockGroup.position as Exclude<Position, null>,
              }
            : { moving: false as const, position: null })}
          currMovingBlock={currMovingBlock}
          currMovingBlockIndex={
            currMovingBlock && currMovingBlockParent
              ? {
                  blockGroupIndex: blockGroups.indexOf(currMovingBlockParent),
                  blockIndex:
                    currMovingBlockParent.blocks.indexOf(currMovingBlock),
                }
              : null
          }
          currMovingBlockGroup={
            !blockGroup.moving ? currMovingBlockGroup : null
            // !blockGroup.moving
            //   ? currMovingBlockGroup &&
            //     blockGroup.blocks.length + currMovingBlockGroup.blocks.length <= 5
            //     ? currMovingBlockGroup
            //     : null
            //   : null
          }
          invalidMove={
            !!(
              (currMovingBlock &&
                currMovingBlockParent !== blockGroup &&
                blockGroup.blocks.length + 1 > 5) ||
              (!blockGroup.moving &&
                currMovingBlockGroup &&
                blockGroup.blocks.length + currMovingBlockGroup.blocks.length >
                  5)
            )
            // currMovingBlockGroup &&
            // previewIndex &&
            // blockGroupIndex === previewIndex.blockGroupIndex &&
            // blockGroup.blocks.length + currMovingBlockGroup.blocks.length > 5
            //   ? true
            //   : false
          }
          previewIndex={
            previewIndex && blockGroupIndex === previewIndex.blockGroupIndex
              ? previewIndex.blockIndex
              : null
          }
          isDeleting={isDeleting}
          onTypeUpdate={handleTypeUpdate}
          onTextUpdate={handleTextUpdate}
          onImageUpdate={handleImageUpdate}
          onAttemptLoadUpdate={handleAttemptLoadUpdate}
          onSetFocus={handleSetFocus}
          // onSetMoving={handleSetMoving}
          onOpenColorPicker={handleOpenColorPicker}
          onSelectColor={handleSelectColor}
          onAddBlock={handleAddBlock}
          onDeleteBlock={handleDeleteBlock}
          onBlockMove={handleBlockMove}
          onAddBlockGroup={handleAddBlockGroup}
          // onBlockMove={handleBlockMove}
          onBlockGroupMove={handleBlockGroupMove}
          onBlockGroupCancelMove={handleBlockGroupCancelMove}
          onMovingBlockUpdate={handleMovingBlockUpdate}
          onPreviewIndexUpdate={handlePreviewIndexUpdate}
          onPromptUpdate={handlePromptUpdate}
          onQueryAi={handleQueryAi}
          onMergeChar={handleMergeChar}
        />
      ))}
    </div>
  );
}

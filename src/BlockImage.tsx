import { FormEvent, useEffect, useRef, useState } from "react";
import BlockImageControls from "./BlockImageControls";

interface BlockImageProps {
  imgUrl: string | null;
  attemptLoad: boolean;
  isDeleting: boolean;
  onImageUpdate: (imgUrl: string | null) => void;
  onAttemptLoadUpdate: (attemptLoad: boolean) => void;
}

interface ImageOpenInfo {
  // isOpen: boolean;
  // startX: number | null;
  // startY: number | null;
  animatingOut: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export default function BlockImage({
  imgUrl,
  attemptLoad,
  isDeleting,
  onImageUpdate,
  onAttemptLoadUpdate,
}: BlockImageProps) {
  // const [attemptedLoad, setAttemptedLoad] = useState<boolean>(false);
  // const [image, setImage] = useState<string | null>(null);
  const [imageOpenInfo, setImageOpenInfo] = useState<ImageOpenInfo | null>(
    null
  );

  const imageInnerRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: KeyboardEvent) {
    console.log("key pressed");
    console.log(e.key);
    console.log(imageInnerRef.current);
    console.log(imageOpenInfo);
    console.log(!imageOpenInfo?.animatingOut);
    if (
      e.key === "Escape" &&
      imageInnerRef.current &&
      imageOpenInfo &&
      !imageOpenInfo.animatingOut
    ) {
      console.log("should animate out");
      e.preventDefault();
      e.stopPropagation();
      const imageRect = imageInnerRef.current.getBoundingClientRect();
      setImageOpenInfo({
        animatingOut: true,
        startX: imageRect.left + imageRect.width / 2,
        startY: imageRect.top + imageRect.height / 2,
        startWidth: imageRect.width,
        startHeight: imageRect.height,
      });
      // console.log(focusIndex);
      // if (focusIndex) {
      //   // console.log("received escape");
      //   setFocusIndex(null);
      // } else {
      //   console.log("should set deleting");
      //   setIsDeleting(!isDeleting);
      // }
    }
  }

  function handleClick() {
    if (!imageInnerRef.current || imageOpenInfo?.animatingOut || isDeleting)
      return;
    const imageRect = imageInnerRef.current.getBoundingClientRect();
    if (imageOpenInfo) {
      // const newInfo = { ...imageOpenInfo };
      // newInfo.animatingOut = true;
      // setImageOpenInfo(newInfo);

      // TODO: check if this info can be taken directly from imageOpenInfo
      // the starting position is calculated again, in case the image was edited
      setImageOpenInfo({
        animatingOut: true,
        startX: imageRect.left + imageRect.width / 2,
        startY: imageRect.top + imageRect.height / 2,
        startWidth: imageRect.width,
        startHeight: imageRect.height,
      });
    } else
      setImageOpenInfo({
        animatingOut: false,
        startX: imageRect.left + imageRect.width / 2,
        startY: imageRect.top + imageRect.height / 2,
        startWidth: imageRect.width,
        startHeight: imageRect.height,
      });
  }

  // function handleDoubleClick() {
  //   promptForFile();
  // }

  function handleAnimationEnd() {
    if (!imageOpenInfo || !imageOpenInfo.animatingOut) return;
    // const newInfo = { ...imageOpenInfo };
    // newInfo.animatingOut = false;
    // setImageOpenInfo(newInfo);
    setImageOpenInfo(null);
  }

  function handleEditImage() {
    promptForFile();
  }

  function handleDeleteImage() {
    setImageOpenInfo(null);
    onImageUpdate(null);
  }

  function handleChange(e: FormEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.addEventListener(
      "load",
      () => {
        // FIXME: macos colorspace of screenshots messes this up. fix so that screenshots don't show up desaturated.
        // ^ perhaps use html canvas to get the base 64 url?
        if (typeof fileReader.result !== "string")
          throw new Error(
            `Unexpected file reader result type: ${typeof fileReader.result}`
          );
        // console.log(fileReader.result);
        // setImage(fileReader.result);
        onImageUpdate(fileReader.result);
      },
      { once: true }
    );
    fileReader.readAsDataURL(file);
  }

  function promptForFile() {
    // onImageUpdate(null);
    // setAttemptedLoad(true);
    onAttemptLoadUpdate(false);
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    return () => document.body.removeEventListener("keydown", handleKeyDown);
  }, [imageInnerRef, imageOpenInfo]);

  useEffect(() => {
    if (attemptLoad) promptForFile();
  }, [attemptLoad]);

  return (
    <div className="blockImage">
      {imgUrl ? (
        <img
          ref={imageInnerRef}
          className={`blockImageInner ${imageOpenInfo ? "hide" : ""}`}
          src={imgUrl}
          alt="Uploaded image"
          onClick={handleClick}
          // onDoubleClick={handleDoubleClick}
        />
      ) : (
        ""
      )}
      {imgUrl && imageOpenInfo ? (
        <div
          className={`blockImageOpenWrapper regionsIgnore ${
            imageOpenInfo.animatingOut ? "animOut" : ""
          }`}
          onClick={handleClick}
          // style={{
          //   left: imageOpenInfo.startX,
          //   top: imageOpenInfo.startY,
          // }}
        >
          <img
            className="blockImageOpen"
            src={imgUrl}
            alt="Uploaded image"
            // onClick={handleClick}
            // onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            style={{
              left: imageOpenInfo.startX,
              top: imageOpenInfo.startY,
              maxWidth: imageOpenInfo.startWidth,
              maxHeight: imageOpenInfo.startHeight,
            }}
          />
          {/* TODO: add functionality to controls */}
          <BlockImageControls
            onEditImage={handleEditImage}
            onDeleteImage={handleDeleteImage}
          />
          {/* <div className="imageControls">
            <div className="editImage">
              <svg
                width="66"
                height="66"
                viewBox="0 0 66 66"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50.1525 1.20528C51.324 0.0337037 53.2235 0.033704 54.3951 1.20528L64.2946 11.1048C65.4662 12.2763 65.4662 14.1758 64.2946 15.3474L55.8093 23.8327L41.6672 9.69056L50.1525 1.20528Z"
                  // fill="black"
                />
                <path
                  d="M38.1316 13.2261L5.60473 45.753C5.37158 45.978 5.18829 46.2668 5.08263 46.6121L0.133719 62.7824C-0.347815 64.3558 1.14404 65.8477 2.71743 65.3661L18.8878 60.4172C19.2331 60.3116 19.5216 60.1281 19.7466 59.8949L52.2738 27.3682L38.1316 13.2261Z"
                  // fill="black"
                />
              </svg>
            </div>
            <div className="deleteImage">
              from https://flowbite.com/icons/
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div> */}
        </div>
      ) : (
        ""
      )}
      <input
        ref={fileInputRef}
        className="blockImageUpload"
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleChange}
      />
    </div>
  );
}

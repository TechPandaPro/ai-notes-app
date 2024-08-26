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
      // the starting position is calculated again, in case the image was edited since when the image was initially opened
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

  function handleAnimationEnd() {
    if (!imageOpenInfo || !imageOpenInfo.animatingOut) return;
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
        if (typeof fileReader.result !== "string")
          throw new Error(
            `Unexpected file reader result type: ${typeof fileReader.result}`
          );
        onImageUpdate(fileReader.result);
      },
      { once: true }
    );
    fileReader.readAsDataURL(file);
  }

  function promptForFile() {
    onAttemptLoadUpdate(false);
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    return () => document.body.removeEventListener("keydown", handleKeyDown);
  }, [imageInnerRef, imageOpenInfo]);

  useEffect(() => {
    console.log("check prompt");
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
        >
          <img
            className="blockImageOpen"
            src={imgUrl}
            alt="Uploaded image"
            onAnimationEnd={handleAnimationEnd}
            style={{
              left: imageOpenInfo.startX,
              top: imageOpenInfo.startY,
              maxWidth: imageOpenInfo.startWidth,
              maxHeight: imageOpenInfo.startHeight,
            }}
          />
          <BlockImageControls
            onEditImage={handleEditImage}
            onDeleteImage={handleDeleteImage}
          />
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

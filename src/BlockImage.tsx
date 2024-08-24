import { FormEvent, useEffect, useRef, useState } from "react";

interface BlockImageProps {
  imgUrl: string | null;
  attemptLoad: boolean;
  onImageUpdate: (imgUrl: string | null) => void;
  onAttemptLoadUpdate: (attemptLoad: boolean) => void;
}

interface ImageOpenInfo {
  // isOpen: boolean;
  // startX: number | null;
  // startY: number | null;
  startX: number;
  startY: number;
  startWidth: number;
}

export default function BlockImage({
  imgUrl,
  attemptLoad,
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

  function handleClick() {
    if (!imageInnerRef.current) return;
    const imageRect = imageInnerRef.current.getBoundingClientRect();
    // if (imageOpenInfo) setImageOpenInfo(null);
    // else
    setImageOpenInfo({
      startX: imageRect.left,
      startY: imageRect.top,
      startWidth: imageRect.width,
    });
  }

  function handleDoubleClick() {
    promptForFile();
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
        console.log(fileReader.result);
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
          onDoubleClick={handleDoubleClick}
        />
      ) : (
        ""
      )}
      {imgUrl && imageOpenInfo ? (
        <div
          className="blockImageOpenWrapper"
          style={{
            left: imageOpenInfo.startX,
            top: imageOpenInfo.startY,
            width: imageOpenInfo.startWidth,
          }}
        >
          <img
            className="blockImageOpen"
            src={imgUrl}
            alt="Uploaded image"
            // onClick={handleClick}
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

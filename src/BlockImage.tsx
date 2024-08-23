import { FormEvent, useEffect, useRef, useState } from "react";

interface BlockImageProps {
  imgUrl: string | null;
  onImageUpdate: (imgUrl: string | null) => void;
}

export default function BlockImage({ imgUrl, onImageUpdate }: BlockImageProps) {
  const [attemptedLoad, setAttemptedLoad] = useState<boolean>(false);
  // const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!attemptedLoad) {
      setAttemptedLoad(true);
      if (!fileInputRef.current) return;
      fileInputRef.current.click();
    }
  }, [attemptedLoad]);

  return (
    <div className="blockImage">
      {imgUrl ? <img src={imgUrl} alt="Uploaded image" /> : ""}
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

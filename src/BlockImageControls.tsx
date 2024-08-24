import BlockImageControl from "./BlockImageControl";

interface BlockImageControlsProps {
  onEditImage: () => void;
  onDeleteImage: () => void;
}

export default function BlockImageControls({
  onEditImage,
  onDeleteImage,
}: BlockImageControlsProps) {
  function handleClick(controlId: string) {
    switch (controlId) {
      case "editImage":
        onEditImage();
        break;
      case "deleteImage":
        onDeleteImage();
        break;
      default:
        throw new Error(`Unrecognized block control ID ${controlId}`);
    }
    // if (controlId === "editImage") {
    // } else if (controlId === "deleteImage") {
    // } else throw new Error(`Unrecognized block control ID ${controlId}`);
  }

  return (
    <div className="imageControls">
      <BlockImageControl
        id="editImage"
        svg={
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
        }
        onClick={handleClick}
      />
      <BlockImageControl
        id="deleteImage"
        // from https://flowbite.com/icons/
        svg={
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
        }
        onClick={handleClick}
      />
    </div>
  );
}

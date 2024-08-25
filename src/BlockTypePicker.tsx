// first two text/header svgs made in figma
// third image svg from https://flowbite.com/icons/

import BlockTypeOption, { BlockType } from "./BlockTypeOption";

// FIXME: fix broken picker (text/header does not work)

interface BlockTypePickerProps {
  selectedOption: BlockType;
  onTypeUpdate: (type: BlockType) => void;
}

export default function BlockTypePicker({
  selectedOption,
  onTypeUpdate,
}: BlockTypePickerProps) {
  // function handleSelectOption(typeId: string) {
  //   if (typeId === "image") {

  //   }
  //   onTypeUpdate(typeId);
  // }

  return (
    <div className="blockTypePickerWrapper">
      <div className="blockTypePicker">
        <BlockTypeOption
          type={BlockType.Text}
          isTextOption={true}
          svg={
            <svg
              width="35"
              height="50"
              viewBox="0 0 35 50"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5833 46V8.45541H0V4H35V8.45541H20.4167V46H14.5833Z"
                // fill="black"
              />
            </svg>
          }
          isSelected={selectedOption === BlockType.Text}
          onSelectOption={onTypeUpdate}
        />
        <BlockTypeOption
          type={BlockType.Header}
          isTextOption={true}
          svg={
            <svg
              width="25"
              height="30"
              viewBox="0 0 25 30"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 30V0H6.27036V12.1824H18.7296V0H25V30H18.7296V16.3176H6.27036V30H0Z"
                // fill="black"
              />
            </svg>
          }
          isSelected={selectedOption === BlockType.Text}
          onSelectOption={onTypeUpdate}
        />
        <BlockTypeOption
          type={BlockType.Image}
          isTextOption={false}
          svg={
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 6C11 5.73478 11.1054 5.48043 11.2929 5.29289C11.4804 5.10536 11.7348 5 12 5H12.01C12.2752 5 12.5296 5.10536 12.7171 5.29289C12.9046 5.48043 13.01 5.73478 13.01 6C13.01 6.26522 12.9046 6.51957 12.7171 6.70711C12.5296 6.89464 12.2752 7 12.01 7H12C11.7348 7 11.4804 6.89464 11.2929 6.70711C11.1054 6.51957 11 6.26522 11 6Z"
                // fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H18C18.5304 0 19.0391 0.210714 19.4142 0.585786C19.7893 0.960859 20 1.46957 20 2V14C20 14.556 19.773 15.06 19.407 15.422C19.3267 15.5948 19.1986 15.7411 19.0379 15.8435C18.8772 15.9459 18.6906 16.0002 18.5 16H2C1.46973 15.9995 0.961329 15.7886 0.586371 15.4136C0.211413 15.0387 0.000529477 14.5303 0 14V2ZM6.892 14L10.725 8.644L6.735 4.322C6.63421 4.21272 6.51032 4.12728 6.37235 4.07192C6.23438 4.01655 6.0858 3.99264 5.93742 4.00193C5.78904 4.01123 5.64461 4.05348 5.51462 4.12563C5.38464 4.19778 5.27237 4.298 5.186 4.419L2 8.879V2H18V11.95L14.743 8.331C14.6429 8.21977 14.519 8.13244 14.3806 8.07545C14.2422 8.01845 14.0928 7.99325 13.9434 8.0017C13.794 8.01014 13.6483 8.05202 13.5173 8.12424C13.3862 8.19647 13.273 8.2972 13.186 8.419L9.2 14H6.892Z"
                // fill="black"
              />
            </svg>
          }
          isSelected={selectedOption === BlockType.Image}
          onSelectOption={onTypeUpdate}
        />
      </div>
    </div>
  );
}

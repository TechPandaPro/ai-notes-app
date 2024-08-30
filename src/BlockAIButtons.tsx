// import { KeyboardEvent } from "react";
import BlockAIButton from "./BlockAIButton";
import BlockAIPrompt from "./BlockAIPrompt";

interface BlockAIButtonsProps {
  regenPrompt: string;
  onPromptUpdate: (newPrompt: string) => void;
  onRegenerate: () => void;
  onInsert: () => void;
}

export default function BlockAIButtons({
  regenPrompt,
  onPromptUpdate,
  onRegenerate,
  onInsert,
}: BlockAIButtonsProps) {
  // function handleKeyDown(e: KeyboardEvent) {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     onRegenerate();
  //   }
  // }

  function handleClick(buttonId: string) {
    switch (buttonId) {
      case "regenerate":
        onRegenerate();
        break;
      case "insert":
        onInsert();
        break;
      default:
        throw new Error(`Unrecognized block control ID ${buttonId}`);
    }
  }

  return (
    <div className="aiBlockInnerHeaderButtons">
      {/* <input
        type="text"
        className="aiBlockInnerHeaderInput"
        onKeyDown={handleKeyDown}
      /> */}
      <BlockAIPrompt
        regenPrompt={regenPrompt}
        onPromptUpdate={onPromptUpdate}
        onRegenerate={onRegenerate}
      />
      <BlockAIButton
        id="regenerate"
        title="Regenerate response"
        svg={
          <svg
            width="1063"
            height="699"
            viewBox="0 0 1063 699"
            // fill="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M810.843 247.495C831.297 227.041 864.461 227.038 884.915 247.492L1047.66 410.235C1068.11 430.689 1068.11 463.853 1047.66 484.308C1027.2 504.762 994.043 504.761 973.589 484.307L900.255 410.975L900.254 481.31C900.255 601.148 803.107 698.297 683.268 698.296L216.299 698.296C187.373 698.296 163.924 674.846 163.924 645.92C163.924 616.994 187.374 593.544 216.3 593.545L683.269 593.545C745.254 593.546 795.503 543.296 795.503 481.311L795.503 410.976L722.174 484.308C701.72 504.762 668.557 504.762 648.103 484.308C627.649 463.854 627.649 430.692 648.103 410.238L810.843 247.495Z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M252.966 451.004C232.512 471.458 199.347 471.461 178.893 451.007L16.148 288.264C-4.30615 267.811 -4.30401 234.646 16.1499 214.192C36.6038 193.738 69.7658 193.738 90.2199 214.192L163.554 287.524L163.554 217.189C163.554 97.3508 260.702 0.20273 380.541 0.203351L847.509 0.203123C876.436 0.203268 899.885 23.6528 899.885 52.5792C899.885 81.5055 876.435 104.955 847.509 104.955L380.54 104.954C318.554 104.954 268.305 155.203 268.305 217.188L268.306 287.523L341.635 214.191C362.089 193.737 395.251 193.737 415.705 214.191C436.159 234.645 436.159 267.807 415.706 288.261L252.966 451.004Z"
            />
          </svg>
        }
        onClick={handleClick}
      />
      <BlockAIButton
        id="insert"
        title="Insert response"
        svg={
          <svg
            width="473"
            height="472"
            viewBox="0 0 473 472"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M239.752 10.2513C253.42 -3.41708 275.581 -3.41709 289.249 10.2513L462.491 183.492C476.159 197.161 476.159 219.322 462.491 232.99C448.822 246.658 426.662 246.658 412.993 232.99L299.501 119.497L299.501 327C299.501 407.081 234.582 472 154.501 472H35.7402C16.4103 472 0.740253 456.33 0.740234 437C0.740221 417.67 16.4103 402 35.7402 402H154.501C195.922 402 229.501 368.421 229.501 327L229.501 119.497L116.009 232.99C102.34 246.658 80.1798 246.658 66.5114 232.99C52.8431 219.322 52.8431 197.161 66.5114 183.492L239.752 10.2513Z"
            />
          </svg>
        }
        onClick={handleClick}
      />
    </div>
  );
}

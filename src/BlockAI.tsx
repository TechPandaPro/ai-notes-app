// import BlockAIButton from "./BlockAIButton";
import BlockAIButtons from "./BlockAIButtons";

interface BlockAIProps {
  text: string;
  generating?: boolean;
  addingText?: { char: string; key: string }[];
  onRegenerate: () => void;
  onInsert: () => void;
  onMergeChar: (key: string) => void;
}

export default function BlockAI({
  text,
  generating,
  addingText,
  onRegenerate,
  onInsert,
  onMergeChar,
}: BlockAIProps) {
  return (
    <div
      className={`aiBlockInnerContainer ${
        !generating && (!addingText || addingText.length === 0)
          ? "generated"
          : ""
      }`}
    >
      <div className="aiBlockInnerHeader">
        <svg
          className="aiBlockInnerHeaderIcon"
          width="426"
          height="426"
          viewBox="0 0 426 426"
          // fill="none"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M106.771 208.615C115.797 206.393 122.844 199.345 125.067 190.319L146.677 102.57C152.923 77.2075 188.981 77.2074 195.227 102.57L216.836 190.319C219.059 199.345 226.107 206.393 235.133 208.615L322.882 230.225C348.244 236.471 348.244 272.529 322.882 278.775L235.133 300.384C226.107 302.607 219.059 309.655 216.836 318.681L195.227 406.43C188.981 431.792 152.923 431.792 146.677 406.43L125.067 318.681C122.844 309.655 115.797 302.607 106.771 300.384L19.0219 278.775C-6.34062 272.529 -6.34065 236.471 19.0219 230.225L106.771 208.615Z" />
          <path d="M295.474 69.1356C300.463 67.9068 304.359 64.0111 305.588 59.0215L317.533 10.5151C320.986 -3.50501 340.918 -3.50503 344.371 10.5151L356.317 59.0215C357.545 64.0111 361.441 67.9068 366.431 69.1356L414.937 81.0812C428.957 84.5339 428.957 104.466 414.937 107.919L366.431 119.864C361.441 121.093 357.545 124.989 356.317 129.979L344.371 178.485C340.918 192.505 320.986 192.505 317.533 178.485L305.588 129.979C304.359 124.989 300.463 121.093 295.474 119.864L246.967 107.919C232.947 104.466 232.947 84.5339 246.967 81.0812L295.474 69.1356Z" />
        </svg>
        {/* TODO: prevent height of ai header container from changing */}
        {/* {!visuallyGenerating ? ( */}
        <div className="aiBlockInnerHeaderContent">
          <div className="aiBlockInnerHeaderText">Thinking...</div>
          {/* <div className="aiBlockInnerHeaderButtons"> */}
          <BlockAIButtons onRegenerate={onRegenerate} onInsert={onInsert} />
          {/* <div className="aiBlockInnerHeaderButton">
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
            </div>
            <div
              className="aiBlockInnerHeaderButton"
              onClick={handleInsertClick}
            >
              <svg
                width="473"
                height="472"
                viewBox="0 0 473 472"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M239.752 10.2513C253.42 -3.41708 275.581 -3.41709 289.249 10.2513L462.491 183.492C476.159 197.161 476.159 219.322 462.491 232.99C448.822 246.658 426.662 246.658 412.993 232.99L299.501 119.497L299.501 327C299.501 407.081 234.582 472 154.501 472H35.7402C16.4103 472 0.740253 456.33 0.740234 437C0.740221 417.67 16.4103 402 35.7402 402H154.501C195.922 402 229.501 368.421 229.501 327L229.501 119.497L116.009 232.99C102.34 246.658 80.1798 246.658 66.5114 232.99C52.8431 219.322 52.8431 197.161 66.5114 183.492L239.752 10.2513Z"
                />
              </svg>
            </div> */}
          {/* </div> */}
        </div>
        {/* ) : ( */}
        {/* "" */}
        {/* )} */}
      </div>
      <div className="aiBlockInnerText">
        {text}
        {addingText
          ? addingText.map((char) => (
              <span
                key={char.key}
                className="char"
                onAnimationEnd={() => onMergeChar(char.key)}
              >
                {char.char}
              </span>
            ))
          : ""}
      </div>
    </div>
  );
}

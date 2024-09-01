// export interface Tab {
//   name: string;
//   current: boolean;
// }

// import { useEffect, useRef, useState } from "react";
import { MouseEvent, useEffect, useRef } from "react";

interface ToolbarTabProps {
  id: string;
  name: string;
  current: boolean;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

export default function ToolbarTab({
  id,
  name,
  current,
  onSelectTab,
  onCloseTab,
}: ToolbarTabProps) {
  // const [prevIsCurrent, setPrevIsCurrent] = useState<boolean>(false);
  const openTabRef = useRef<HTMLDivElement>(null);

  // if (current !== prevIsCurrent) {
  //   setPrevIsCurrent(current);
  //   if (current) {
  //     console.log("scroll into view");
  //     console.log(openTabRef.current);
  //   }
  // }

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onSelectTab(id);
  }

  function handleCloseClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onCloseTab(id);
  }

  useEffect(() => {
    if (current) {
      console.log("scroll into view");
      if (openTabRef.current) openTabRef.current.scrollIntoView();
    }
  }, [current]);

  return (
    <div
      ref={openTabRef}
      className={`openTab ${current ? "current" : ""}`}
      onClick={handleClick}
    >
      <div className="tabText">{name}</div>
      <div className="closeTab" onClick={handleCloseClick}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      </div>
      {current ? <div className="currentBar"></div> : ""}
    </div>
  );
}

// export interface Tab {
//   name: string;
//   current: boolean;
// }

// import { useEffect, useRef, useState } from "react";
import { useEffect, useRef } from "react";

interface ToolbarTabProps {
  id: string;
  name: string;
  current: boolean;
  onSelectTab: (id: string) => void;
}

export default function ToolbarTab({
  id,
  name,
  current,
  onSelectTab,
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

  function handleClick() {
    onSelectTab(id);
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
      {name}
    </div>
  );
}

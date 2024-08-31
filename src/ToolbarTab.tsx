// export interface Tab {
//   name: string;
//   current: boolean;
// }

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
  function handleClick() {
    onSelectTab(id);
  }

  return (
    <div
      className={`openTab ${current ? "current" : ""}`}
      onClick={handleClick}
    >
      {name}
    </div>
  );
}

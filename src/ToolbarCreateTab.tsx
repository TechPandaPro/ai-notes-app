interface ToolbarCreateTabProps {
  onCreateTab: () => void;
}

export default function ToolbarCreateTab({
  onCreateTab,
}: ToolbarCreateTabProps) {
  function handleClick() {
    onCreateTab();
  }

  return (
    // <div className="createTab" onClick={handleClick}>
    <div className="createTab">
      {/* https://flowbite.com/icons/ */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        onClick={handleClick}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 12h14m-7 7V5"
        />
      </svg>
    </div>
  );
}

// import { createRoot } from "react-dom/client";

import DragRegion from "./DragRegion";
import NoteContent from "./NoteContent";

// const root = createRoot(document.body);
// root.render(<h2>Hello from React!</h2>);

export default function App() {
  return (
    <>
      <DragRegion />
      <NoteContent />
    </>
  );
}

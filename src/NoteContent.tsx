import { FormEvent, useState } from "react";

interface Segment {
  key: string;
  text: string;
}

export default function NoteContent() {
  const [segments, setSegments] = useState<Segment[]>([]);

  function handleInput(e: FormEvent<HTMLDivElement>) {
    console.log(e.target);
    console.log("Hey!");
    setSegments(
      Array.from((e.target as HTMLElement).querySelectorAll("div, h2")).map(
        (elem) => ({
          key: (elem as HTMLElement).dataset.key ?? Date.now().toString(),
          text: (elem as HTMLElement).innerText,
        })
      )
    );
    console.log(segments);
    // (e.target as HTMLElement).innerHTML = "";
  }

  return (
    // <div className="noteContent">
    //   <h2>Hello, World!</h2>
    // </div>
    <div
      className="noteContent"
      contentEditable={true}
      onInput={handleInput}
      suppressContentEditableWarning={true}
    >
      {/* <h2>Hello, World!</h2> */}
      {segments.map((segment) => (
        <p key={segment.key} data-key={segment.key}>
          {segment.text}
        </p>
      ))}
      {/* <textarea></textarea> */}
    </div>
  );
}

// import { FormEvent, useState } from "react";

// export default function NoteContent() {
//   const [segments, setSegments] = useState([]);

//   function handleInput(e: FormEvent<HTMLDivElement>) {
//     console.log(e.target);
//     console.log("Hey!");
//     setSegments(
//       Array.from((e.target as HTMLElement).querySelectorAll("div, h2")).map(
//         (elem) => (elem as HTMLElement).innerText
//       )
//     );
//     console.log(segments);
//   }

//   return (
//     // <div className="noteContent">
//     //   <h2>Hello, World!</h2>
//     // </div>
//     <div
//       className="noteContent"
//       contentEditable={true}
//       onInput={handleInput}
//       suppressContentEditableWarning={true}
//     >
//       {/* <h2>Hello, World!</h2> */}
//       {segments.map((segment) => (
//         <p>{segment}</p>
//       ))}
//       {/* <textarea></textarea> */}
//     </div>
//   );
// }

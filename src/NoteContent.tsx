import { FormEvent, isValidElement, useState } from "react";

interface Segment {
  key: string;
  text: string;
}

export default function NoteContent() {
  const [segments, setSegments] = useState<Segment[]>([]);

  function handleInput(e: FormEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    console.log(target);
    console.log("Hey!");
    if (target.innerText === target.innerHTML) {
      const targetText = target.innerText;
      target.innerHTML = "";
      const newParagraph = document.createElement("p");
      newParagraph.innerText = targetText;
      target.append(newParagraph);
      // setSegments([]);
    }
    // for (const elem of target.querySelectorAll("br")) elem.remove();
    // const targets = target.querySelectorAll("p, div, h2, br")
    setSegments(
      Array.from(target.querySelectorAll("p, div, h2, br")).map((_elem) => {
        const elem = _elem as HTMLElement;
        if (!elem.dataset.key) elem.dataset.key = Date.now().toString();
        const newInfo = {
          // key: elem.dataset.key ?? Date.now().toString(),
          key: elem.dataset.key,
          text: elem.innerText,
        };
        // elem.dataset.key = newInfo.key;
        console.log(isValidElement(elem));
        return newInfo;
      })
    );
    for (const elem of target.querySelectorAll(":not([data-registered])")) {
      elem.remove();
      console.log(elem);
    }
    console.log("segments:");
    console.log(segments);
    // (e.target as HTMLElement).innerHTML = "";
    // for (const elem of target.querySelectorAll("p, div, h2")) {
    //   console.log(elem);
    //   elem.remove();
    // }
  }

  console.log("after render:");
  console.log(segments);
  console.log(segments.map((s) => s.key));

  console.log(
    segments.map((segment) => (
      <p key={segment.key} data-key={segment.key} data-registered={true}>
        {segment.text}
      </p>
    ))
  );

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
        <p
          key={segment.key}
          data-key={segment.key}
          data-registered={true}
          // className="section"
        >
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

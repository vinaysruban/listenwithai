"use client";
import { useEffect, useState } from "react";

export default function Response({
  text,
  status,
}: {
  text: string;
  status: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(-1);
  const [gap, setGap] = useState<number>(500);
  const splitText = text.split(" ");

  useEffect(() => {
    setDisplayText("");
    setIndex(1);
    setGap(500);
  }, [text]);

  useEffect(() => {
    const tick = () => {
      if (index > splitText.length - 1) return;
      setDisplayText(
        (prevDisplayText) => prevDisplayText + " " + splitText[index]
      );
      setIndex((i) => i + 1);
    };

    const id = setInterval(tick, Math.floor(Math.random() * gap));
    return () => clearInterval(id);
  }, [splitText, index, gap]);

  return (
    <div className="w-3/5 m-auto text-center">
      <p className="w-100 font-semibold text-md my-4">
        {status === "idle"
          ? <span>Choose your audio file above 👆</span>
          : status === "upload"
          ? <span>Please wait a second ⏰</span>
          : status === "ready"
          ? <span>Click the button above to get your transcription 😊</span>
          : status === "load"
          ? <span>We&apos;re generating it right now ✍</span>
          : status === "reject"
          ? <span><b>An error occured.</b><br />The most likely scenario is that you need to give more audio 👂, or otherwise you need to split your audio into chunks and give it to us as we can&apos;t handle it all at once.<br />Otherwise, you may have uploaded a file with an extension <i>that is not ❌</i> <code>.mp3</code>, <code>.wav</code>, <code>.m4a</code> or another format that we recognise.<br />Please convert it into one of these using an online converter (inbuilt converter coming soon).</span>
          : <span onClick={() => {navigator.clipboard.writeText(splitText[0] + displayText)}}>{splitText[0] + displayText}</span>}
      </p>
      <button
        role="button"
        className="bg-slate-900 text-white font-semibold py-2 px-4 rounded-2xl"
        onClick={() => setGap(50)}
      >
        Speed Up
      </button>
    </div>
  );
}

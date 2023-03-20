"use client";
import { ChangeEvent, useState } from "react";
import Output from "./output";

type Status =
  | "idle"
  | "upload"
  | "ready"
  | "load"
  | "reject"
  | "complete";

export default function Input() {
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [convertedText, setConvertedText] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStatus("upload");
      const file: File = e.target.files[0];

      const data = new FormData();
      data.append("file", file);
      setFormData(data);

      if (file.size > 25 * 1024 * 1024) {
        alert("Please upload an audio file less than 25MB");
        setStatus("reject")
        return;
      }
      setStatus("ready");
    }
  };

  const sendAudio = async () => {
    setStatus("load");
    console.time("apicall")
    const res = await fetch("api/transcribe", {
      method: "POST",
      body: formData,
    });
    console.timeEnd("apicall")

    if (!res.ok) {
      setStatus("reject");
      console.log('uh oh')
      return;
    }

    const data = await res.json()
    const text = data.resp.data.text

    try {
      text.split(" ");
    } catch (err) {
      setStatus("reject");
      return;
    }
    setStatus("complete");
    setConvertedText(text);
  };

  return (
    <>
      <input
        className="my-4"
        type="file"
        accept="audio/*"
        onChange={handleFile}
      />
      <button
        className="my-2 w-1/5 mx-auto border-2 border-slate-900 rounded-2xl px-2 py-1 text-slate-900 hover:bg-slate-900 hover:text-slate-300 transition-all"
        onClick={sendAudio}
      >
        Send Audio
      </button>
      <Output text={convertedText} status={status} />
    </>
  );
}

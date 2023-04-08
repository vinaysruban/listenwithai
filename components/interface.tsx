"use client";
import { ChangeEvent, useState } from "react";
import Response from "./response";

type Status = "idle" | "upload" | "ready" | "load" | "reject" | "complete";

type Data = {
  resp: {
    data: {
      text: string;
    };
    status: number;
    statusText: string;
  };
};

export default function Interface() {
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
      setStatus("ready");
    }
  };

  const sendAudio = async () => {
    setStatus("load");
    console.time("apicall");
    const res = await fetch("api/transcribe", {
      method: "POST",
      body: formData,
    });
    console.timeEnd("apicall");

    if (!res.ok) {
      setStatus("reject");
      return;
    }

    const data: Data = await res.json();
    console.log(data);

    if (!data.resp.data.text) {
      setStatus("reject");
      return;
    }
    setConvertedText(data.resp.data.text);
    setStatus("complete");
  };

  return (
    <>
      <label htmlFor="file" className="mt-2 text-slate-800 font-medium">
        The file goes in here 👇
      </label>
      <input
        className="my-4"
        type="file"
        name="file"
        accept="audio/*"
        onChange={handleFile}
      />
      <button
        className="my-2 mx-auto border-2 border-slate-900 rounded-2xl px-12 py-1 text-slate-900 hover:bg-slate-900 hover:text-slate-300 transition-all"
        onClick={sendAudio}
      >
        Send Audio
      </button>
      <Response text={convertedText} status={status} />
    </>
  );
}

import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import formidable from "formidable";
import { Writable, Readable } from "stream";
import fs, { createReadStream } from "fs";
import { Configuration, OpenAIApi } from "openai";

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000_000_000_000_000_000,
  maxFieldsSize: 10_000_000_000_000_000_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(404).end();

  try {
    const chunks: never[] = [];

    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      // consume this, otherwise formidable tries to save the file to disk
      fileWriteStreamHandler: () => fileConsumer(chunks),
    });

    const fileData = Buffer.concat(chunks);
    fs.writeFileSync("tmp/input.wav", fileData);
    fs.stat("tmp/input.wav", (error, stats) => {
      if (error) {
        console.error(error);
      }
      if (stats.size >= 11557458) {
        return res.status(500).json({ error: "File too large" });
      }
    });

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const resp = await openai.createTranscription(
      //@ts-ignore
      createReadStream("tmp/input.wav"),
      "whisper-1"
    );

    delete resp.request;
    return res.status(200).json({ resp });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

import "./globals.css";
import Interface from "@/components/interface";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title:
    "Listen With AI 👂 - Convert your speech to an editable ✏, downloadable transcript! 📝",
  description:
    "Listen With AI is a cutting-edge website that utilizes advanced artificial intelligence technology to seamlessly convert speech into text. Our platform is designed to provide fast, accurate and reliable transcription services for a wide range of applications, from meetings and lectures to interviews and podcasts. With Listen With AI, you can save time and boost productivity by quickly transcribing audio content into text. Our user-friendly interface and intuitive features make it easy to use, even for those without technical expertise. Try Listen With AI today and experience the power of AI-assisted transcription.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <section className="flex flex-col place-items-center">
            {children}
            <Interface />
          </section>
        </main>
        <Analytics />
      </body>
    </html>
  );
}

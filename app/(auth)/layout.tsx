import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative h-screen w-full ">
      <div className="absolute size-full">
        <Image
          src={"/images/bg-img.png"}
          alt="background"
          fill
          className="size-full"
        />
      </div>
      <Toaster />
      {children}
    </main>
  );
}

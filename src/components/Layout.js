import Image from 'next/image';
import Link from 'next/link';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen font-outfit overflow-hidden max-w-screen-xl mx-auto text-gray-900">
      <div className="absolute top-0 left-0 w-full object-contain ">
        <img src="/hero-background.png" alt="" className="w-full h-full" />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10 z-10 relative">
        <header className="mb-9">
          <Link href="/" className="flex items-center justify-center gap-2 mb-9">
            <Image src="/NoteCodeLogo.svg" alt="NoteCode" width={32} height={32} className="w-full h-5" />
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3">Create & Share</h1>
            <h2 className="text-4xl font-bold opacity-90">Your Code easily</h2>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

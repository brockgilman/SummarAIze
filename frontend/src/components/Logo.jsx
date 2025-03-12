import Image from 'next/image';

export default function Logo() {
  return (
    <div className="absolute top-0 left-0 p-4 bg-white z-50">
      <Image
        src="/summaraizeLogo.svg"
        alt="SummarAIze Logo"
        width={100}
        height={100}
        className="h-10 w-10"
      />
    </div>
  );
}
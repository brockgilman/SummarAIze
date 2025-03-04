import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
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
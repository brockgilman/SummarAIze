export default function Logo() {
  return (
    <div className="absolute top-0 left-0 p-4 bg-white z-50">
      <img
        src="/summaraizeLogo.svg"
        alt="SummarAIze Logo"
        style={{ maxWidth: '100px', maxHeight: '100px' }}
      />
    </div>
  );
}
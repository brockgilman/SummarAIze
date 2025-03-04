import Logo from './Logo';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-100 py-4">
      <div className="px-4 flex items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>
      </div>
    </nav>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-full">
      <p>
        not found. <Link href="/">return home</Link>
      </p>
    </div>
  );
}

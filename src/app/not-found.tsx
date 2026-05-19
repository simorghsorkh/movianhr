import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Movi<span className="text-primary-600">an</span></span>
        </Link>

        {/* 404 illustration */}
        <div className="mb-8">
          <div className="text-[120px] font-extrabold leading-none text-primary-100 select-none">
            404
          </div>
          <div className="-mt-6 relative">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-4xl">🔍</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this page took a wrong turn on its career path.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-green-600">Agapay</h1>
          <p className="text-xl text-gray-600">
            Telehealth made simple. Connect with a doctor from anywhere.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            Sign up
          </Link>
        </div>

        <p className="text-sm text-gray-400">
          Patient or Doctor — one platform for both.
        </p>
      </div>
    </main>
  );
}
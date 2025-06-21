import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">Ting Ting</h1>
        <p className="text-xl sm:text-2xl text-orange-500">
          The simplest way to stay consistent.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            Just say it. Ting Ting remembers.
          </h2>
          <div className="space-y-2 text-lg text-gray-800 dark:text-gray-200">
            <p>"Remind me to journal every night."</p>
            <p>"Check on my progress every 3 days."</p>
            <p>"Ask me about my reading habit every Sunday."</p>
          </div>
        </div>

        <p className="text-lg sm:text-xl mt-8 max-w-lg text-gray-800 dark:text-gray-200">
          Ting Ting takes your natural words and turns them into smart reminders.
          No forms. No friction.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <a
            className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-black dark:bg-white text-white dark:text-black gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 sm:w-auto"
            href="/dashboard"
          >
            Go to Dashboard
          </a>
          <a
            className="rounded-md border border-solid border-orange-500 text-orange-500 transition-colors flex items-center justify-center hover:bg-orange-500 hover:text-white font-medium text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto"
            href="#"
          >
            Learn More
          </a>
        </div>
      </main>
      <footer className="row-start-3 text-sm text-gray-600 dark:text-gray-400">
        © 2024 Ting Ting. All rights reserved.
      </footer>
    </div>
  );
}

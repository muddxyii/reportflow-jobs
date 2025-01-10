import Image from "next/image";

export default function Home() {
  return (
      <div className="min-h-screen hero bg-base-200">
        <div className="text-center hero-content">
          <main className="max-w-md">
            <Image
                src="/next.svg"
                alt="AnyBackflow Logo"
                width={180}
                height={38}
                priority
                className="mx-auto dark:invert"
            />

            <h1 className="mt-8 text-3xl font-bold">ReportFlow Jobs</h1>

            <div className="my-6">
              <div className="alert alert-info">
                <span>We&apos;re currently working on something awesome. Please check back later.</span>
              </div>
            </div>

            <a
                href="https://anybackflow.com"
                className="btn btn-primary"
            >
              Return to Main Site
            </a>
          </main>
        </div>
      </div>
  );
}

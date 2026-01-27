import { auth } from "@/lib/auth";
import EventInput from "@/components/EventInput";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <label className="block text-xs uppercase tracking-[0.15em] mb-4"
          style={{ color: "var(--text-muted)" }}>
          Quick Add
        </label>
        {session ? (
          <EventInput />
        ) : (
          <div>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Sign in to add events to your Google Calendar.
            </p>
            <SignInButton />
          </div>
        )}
      </div>
      {session && (
        <div className="fixed bottom-6 right-6">
          <SignOutButton />
        </div>
      )}
    </main>
  );
}

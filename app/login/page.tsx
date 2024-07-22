import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import ToastMessage from "../../components/ui/ToastMessage";
import { Button } from "@/components/ui/button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email === '' || password === ''){
      return redirect("/login?message=Please fill in all fields");
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      return redirect("/login?message=Error creating new account. Please try again");
    }

    return redirect("/dashboard");
  };

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <>
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-32">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>

        <div className="flex justify-center items-center">
          <div className=" border border-slate-200 rounded-md p-5">
            <p className=" text-2xl font-semibold mb-2">Login</p>
            <p className=" text-sm text-slate-600 mb-5">Enter your email and password to login to your account</p>
            <form className=" flex flex-col w-full justify-center gap-2 text-foreground border-slate-400">
              <label className="text-md" htmlFor="email">
                Email
              </label>
              <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                name="email"
                placeholder="you@example.com"
                required
              />
              <label className="text-md" htmlFor="password">
                Password
              </label>
              <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
              <Button formAction={signIn}>
                Sign In
              </Button>
              {searchParams?.message && (
                <ToastMessage message={searchParams.message} />
              )}
            </form>

            <div className=" flex flex-row gap-2 items-center mt-2">
              <p className=" mt-1">Don't have the account ?</p>
              <Link className="text-sm text-blue-600 hover:text-blue-500 mt-1" href="/sign-up">
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
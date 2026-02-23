"use client";

import AnimatePageWrapper from "@/components/animate-page-wrapper";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const loginWithGoogle = () => {
        signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/login"
        })
    }
    const loginWithGithub = () => {
        signIn.social({
            provider: "github",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/login"
        })
    }

    return (
        <AnimatePageWrapper className="flex py-10 md:min-h-screen items-center justify-center font-sans px-4">
            <div
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <h1 className="text-[32px] font-medium tracking-tight text-gray-900 mb-2">
                        Welcome back!
                    </h1>
                    <p className="text-[15px] text-gray-500 max-w-[320px]">
                        Your work, your team, your flow &mdash; all in one place.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                        {error === "state_mismatch" ? "Authentication failed or state mismatched. Please try again or use the provider you registered with." :
                            error === "account_already_exists" ? "An account already exists with this email using a different provider." :
                                error === "github_error" ? "GitHub authentication failed." :
                                    "An error occurred during sign in. Please try again."}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Button variant="outline" className="flex-1" onClick={loginWithGoogle}>
                        <Image src="/google.svg" alt="Google" width={18} height={18} />
                        Sign In with Google
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={loginWithGithub}>
                        <Image src="/github.svg" alt="GitHub" width={18} height={18} />
                        Sign In with GitHub
                    </Button>
                </div>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-400">Or</span>
                    </div>
                </div>

                <form className="space-y-5">
                    <Input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                    />
                    <Input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                    />
                    <Button type="submit" variant="primary" fullWidth>
                        Sign in with email
                    </Button>
                </form>

                <div className="mt-10 text-center text-[14px] text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-medium text-gray-900 hover:underline decoration-gray-400 underline-offset-4 transition-all">
                        Sign Up
                    </Link>
                </div>
            </div>
        </AnimatePageWrapper>
    );
};
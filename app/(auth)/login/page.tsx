"use client";

import AnimatePageWrapper from "@/components/animate-page-wrapper";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import { signIn } from "@/lib/auth-client";
import { AnimatedText } from "@/components/animated-text";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");

    const [loading, setLoading] = useState<"google" | "github" | "credentials" | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const loginWithGoogle = async () => {
        setLoading("google");
        await signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/login",
        });
    };

    const loginWithGithub = async () => {
        setLoading("github");
        await signIn.social({
            provider: "github",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/login",
        });
    };

    const loginWithCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading("credentials");
        setLocalError(null);

        try {
            const res = await signIn.email({
                email,
                password,
                callbackURL: "/",
            });

            if (res?.error) {
                setLocalError(res.error.message || "Invalid email or password.");
                setLoading(null);
            }
        } catch (err) {
            setLocalError("An unexpected error occurred.");
            setLoading(null);
        }
    };

    const displayError = localError || (urlError ? (
        urlError === "state_mismatch" ? "Authentication failed or state mismatched. Please try again." :
            urlError === "account_already_exists" ? "An account already exists with this email using a different provider." :
                urlError === "github_error" ? "GitHub authentication failed." :
                    "An error occurred during sign in. Please try again."
    ) : null);

    return (
        <AnimatePageWrapper className="flex py-10 md:min-h-screen items-center justify-center font-sans px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center text-center mb-10">
                    <h1 className="text-4xl font-medium tracking-tight mb-2">
                        Welcome back!
                    </h1>
                    <p className="text-base text-gray-500 max-w-[70%]">
                        Your work, your team, your flow all in one place.
                    </p>
                </div>

                {displayError && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                        {displayError}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Button
                        variant="outline"
                        className="flex-1 overflow-hidden" // Prevents layout pop
                        onClick={loginWithGoogle}
                        disabled={loading !== null}
                    >
                        <Image src="/google.svg" alt="Google" width={18} height={18} />
                        {/* Added mode="wait" to prevent text overlapping */}
                        <AnimatedText text={loading === "google" ? "Connecting..." : "Sign In with Google"} />
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 overflow-hidden"
                        onClick={loginWithGithub}
                        disabled={loading !== null}
                    >
                        <Image src="/github.svg" alt="GitHub" width={18} height={18} />
                        <AnimatedText text={loading === "github" ? "Connecting..." : "Sign In with GitHub"} />
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

                <form className="space-y-5" onSubmit={loginWithCredentials}>
                    <Input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading !== null}
                    />
                    <Input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading !== null}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        className="overflow-hidden"
                        disabled={loading !== null}
                    >
                        <AnimatedText text={loading === "credentials" ? "Signing in..." : "Sign in with email"} />
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
}
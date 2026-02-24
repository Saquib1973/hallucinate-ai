"use client";

import AnimatePageWrapper from "@/components/animate-page-wrapper";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import { signIn, signUp } from "@/lib/auth-client";
import { AnimatedText } from "@/components/animated-text";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error");

    const [loading, setLoading] = useState<"google" | "github" | "credentials" | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const registerWithGoogle = async () => {
        setLoading("google");
        await signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/register"
        });
    }

    const registerWithGithub = async () => {
        setLoading("github");
        await signIn.social({
            provider: "github",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/register"
        });
    }

    const registerWithCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading("credentials");
        setLocalError(null);

        try {
            const res = await signUp.email({
                email,
                password,
                name: email.split('@')[0],
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
        urlError === "state_mismatch" ? "Authentication failed or state mismatched. Please try again or use the provider you originally registered with." :
            urlError === "account_already_exists" ? "An account already exists with this email." :
                "An error occurred during registration. Please try again."
    ) : null);
    return (
        <AnimatePageWrapper className="flex py-10 md:min-h-screen items-center justify-center font-sans px-4">
            <div
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <h1 className="text-4xl font-medium tracking-tight mb-2">
                        Create an account
                    </h1>
                    <p className="text-base text-gray-500 max-w-[70%]">
                        Join us and start managing your tasks efficiently.
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
                        className="flex-1 overflow-hidden"
                        onClick={registerWithGoogle}
                        disabled={loading !== null}
                    >
                        <Image src="/google.svg" alt="Google" width={18} height={18} />
                        <AnimatedText text={loading === "google" ? "Connecting..." : "Sign Up with Google"} />
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 overflow-hidden"
                        onClick={registerWithGithub}
                        disabled={loading !== null}
                    >
                        <Image src="/github.svg" alt="GitHub" width={18} height={18} />
                        <AnimatedText text={loading === "github" ? "Connecting..." : "Sign Up with GitHub"} />
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

                <form className="space-y-5" onSubmit={registerWithCredentials}>
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
                        <AnimatedText text={loading === "credentials" ? "Signing up..." : "Sign up with email"} />
                    </Button>
                </form>

                <div className="mt-10 text-center text-[14px] text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-gray-900 hover:underline decoration-gray-400 underline-offset-4 transition-all">
                        Sign In
                    </Link>
                </div>
            </div>
        </AnimatePageWrapper>
    );
};


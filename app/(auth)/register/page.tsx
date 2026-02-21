"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const RegisterContent = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const registerWithGoogle = () => {
        signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/register"
        })
    }

    const registerWithGithub = () => {
        signIn.social({
            provider: "github",
            callbackURL: "/",
            errorCallbackURL: window.location.origin + "/register"
        })
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 font-sans text-gray-900">
            <div
                className="w-full max-w-[420px]"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <h1 className="text-[32px] font-medium tracking-tight text-gray-900 mb-2">
                        Create an account
                    </h1>
                    <p className="text-[15px] text-gray-500 max-w-[320px]">
                        Join us and start managing your tasks efficiently.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                        {error === "state_mismatch" ? "Authentication failed or state mismatched. Please try again or use the provider you originally registered with." :
                            error === "account_already_exists" ? "An account already exists with this email." :
                                "An error occurred during registration. Please try again."}
                    </div>
                )}

                <div className="flex gap-4 mb-8">
                    <Button variant="outline" className="flex-1" onClick={registerWithGoogle}>
                        <Image src="/google.svg" alt="Google" width={18} height={18} />
                        Sign Up with Google
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={registerWithGithub}>
                        <Image src="/github.svg" alt="GitHub" width={18} height={18} />
                        Sign Up with GitHub
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
                        Sign up with email
                    </Button>
                </form>

                <div className="mt-10 text-center text-[14px] text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-gray-900 hover:underline decoration-gray-400 underline-offset-4 transition-all">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}

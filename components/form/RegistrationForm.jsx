"use client"

import { cn } from "@/lib/utils"
import { CustomFormField, FormFieldType } from "../CustomFormField"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form"
import { useState } from "react"
import { passwordRules } from "@/constants/rootConstant"
import { RegistrationFormValidation } from "@/lib/RegistrationValidation"
import { registerUser } from "@/lib/actions/register.action"
import { toast } from "sonner"
import SubmitButton from "../common/SubmitButton"
import Link from "next/link"
import { OtpVerificationModal } from "../common/OtpVerificationModal";


export function RegistrationForm({ className, ...props }) {
    const [isLoading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [email, setEmail] = useState("");

    const form = useForm({
        resolver: zodResolver(RegistrationFormValidation),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    async function onSubmit({
        name,
        email,
        password,
    }) {
        setLoading(true);
        try {
            const result = await registerUser({ email, name, password });
            if (result && result.success) {
                setShowOtpModal(true);
                setEmail(email);
                toast("Email sended", {
                    description: result.message,
                })
            } else {
                toast("Failed", {
                    description: result.message,
                });
            }
        } catch (error) {
            toast("Something went wrong", {
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {showOtpModal && <OtpVerificationModal
                setShowOtpModal={setShowOtpModal}
                identifier={email}
            />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className={cn("flex flex-col gap-6", className)}
                    {...props}
                >
                    <div className="flex flex-col items-baseline gap-3">
                        <h1 className="text-2xl font-bold">Sign up</h1>
                        <p className="text-balance text-sm text-muted-foreground font-medium">
                            Let’s get started with your <b className="font-bold">7 days free trial</b>
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Enter your full name"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="name"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Enter your email address"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="email"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="********"
                            iconSrc="/assets/icons/password.svg"
                            iconAlt="password"
                            inputProps={{
                                value: password,
                                onChange: (e) => {
                                    setPassword(e.target.value);
                                    form.setValue("password", e.target.value);
                                },
                            }}

                        />

                        {password && (
                            <ul className="space-y-1 text-sm">
                                {passwordRules.map((rule, i) => {
                                    const passed = rule.test(password);
                                    return <li key={i} className={(passed ? "text-green-500 font-medium" : "text-red-500 font-medium")}>
                                        {passed ? "✅" : "❌"} {" "} {rule.label}
                                    </li>
                                })}
                            </ul>
                        )}

                        <SubmitButton
                            isLoading={isLoading}
                            className="w-full bg-green-400 hover:bg-[#05f27c] cursor-pointer"
                            loadingMessage="Enrolling.."
                        >
                            <span className="font-semibold text-green-900">Sign Up</span>
                        </SubmitButton>
                    </div>
                    <div className="text-center text-sm">
                        Have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

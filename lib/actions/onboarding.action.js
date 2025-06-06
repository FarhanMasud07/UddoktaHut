import { toast } from "sonner";

export const OnboardingRequest = async ({ userId, roles }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/user/assign-role`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), roles }),
        credentials: "include",
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
    toast("Something went wrong", {
      description: err.message,
    });
  }
};

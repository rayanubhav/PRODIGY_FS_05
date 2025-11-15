import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });
    const queryClient = useQueryClient();

    const { mutate: signup, isPending, isError, error } = useMutation({
        mutationFn: async (data) => {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Signup failed");
            return result;
        },
        onSuccess: () => {
            toast.success("Account created! Welcome to Pulse! 🎉");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.username || !formData.fullName || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }
        signup(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen dark:bg-gradient-to-br dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg light:bg-gradient-to-br light:from-white light:via-light-surface light:to-white flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <div className="text-5xl font-bold gradient-text animate-pulse-glow mb-2">
                            <span role="img" aria-label="logo">
                                🚀
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold gradient-text">Join Pulse</h1>
                    </div>
                    <p className="dark:text-gray-400 light:text-gray-600 mt-2">
                        Become part of the community
                    </p>
                </div>

                {/* Form Card */}
                <div className="card-base p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input-base"
                                required
                            />
                        </div>

                        {/* Username & Full Name */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="username"
                                    className="input-base"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="input-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min. 6 characters"
                                className="input-base"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {isError && (
                            <div className="p-3 dark:bg-red-900/20 light:bg-red-100/20 border dark:border-red-800 light:border-red-300 rounded-lg">
                                <p className="text-red-500 text-sm">{error?.message}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn-primary w-full mt-6 py-3"
                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full dark:border-dark-border border-light-border border-t" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="dark:bg-dark-card light:bg-light-card dark:text-gray-400 light:text-gray-600 px-2">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link to="/login">
                        <button type="button" className="btn-secondary w-full py-3">
                            Sign In
                        </button>
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-center dark:text-gray-500 light:text-gray-600 text-sm mt-6">
                    By signing up, you agree to our Terms & Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;

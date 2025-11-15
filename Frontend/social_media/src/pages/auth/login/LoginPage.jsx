import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { toast } from "react-hot-toast";

// ADDED: API URL for deployment
const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const LoginPage = () => {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const queryClient = useQueryClient();

	const { mutate: login, isPending, isError, error } = useMutation({
		mutationFn: async ({ username, password }) => {
			// UPDATED: Use full API_URL
			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Login failed");
			return data;
		},
		onSuccess: () => {
			toast.success("Welcome back! 👋");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData);
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
								✨
							</span>
						</div>
						<h1 className="text-4xl font-bold gradient-text">Pulse</h1>
					</div>
					<p className="dark:text-gray-400 light:text-gray-600 mt-2">
						Join the conversation
					</p>
				</div>

				{/* Form Card */}
				<div className="card-base p-6 md:p-8">
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Username */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Username or Email
							</label>
							<div className="relative">
								<MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 light:text-gray-400" />
								<input
									type="text"
									name="username"
									value={formData.username}
									onChange={handleChange}
									placeholder="Enter your username"
									// FIXED: Added px-4 pl-10 for icon padding
									className="input-base px-4 pl-10"
									required
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Password
							</label>
							<div className="relative">
								<MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 light:text-gray-400" />
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Enter your password"
									// FIXED: Added px-4 pl-10 for icon padding
									className="input-base px-4 pl-10"
									required
								/>
							</div>
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
							{isPending ? "Logging in..." : "Login"}
						</button>
					</form>

					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full dark:border-dark-border border-light-border border-t" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="dark:bg-dark-card light:bg-light-card dark:text-gray-400 light:text-gray-600 px-2">
								New to Pulse?
							</span>
						</div>
					</div>

					{/* Sign Up Link */}
					<Link to="/signup">
						<button type="button" className="btn-secondary w-full py-3">
							Create Account
						</button>
					</Link>
				</div>

				{/* Footer */}
				<p className="text-center dark:text-gray-500 light:text-gray-600 text-sm mt-6">
					By signing in, you agree to our Terms & Privacy Policy
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
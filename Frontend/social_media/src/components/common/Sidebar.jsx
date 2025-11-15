import { Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdHomeFilled, MdOutlineHome } from "react-icons/md";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { FaUser, FaRegUser, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BiLogOut, BiSolidMessageSquareAdd } from "react-icons/bi";
import { MdHelpOutline } from "react-icons/md";
import { toast } from "react-hot-toast";

const Sidebar = () => {
	const location = useLocation();
	const queryClient = useQueryClient();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/auth/logout", { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
		onSuccess: () => {
			toast.success("See you later! 👋");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});

	const isActive = (path) => location.pathname === path;

	const mainNavItems = [
		{ path: "/", icon: MdHomeFilled, outlineIcon: MdOutlineHome, label: "Home", emoji: "🏠" },
		{
			path: "/notifications",
			icon: IoNotifications,
			outlineIcon: IoNotificationsOutline,
			label: "Notifications",
			emoji: "🔔",
		},
		{
			path: `/profile/${authUser?.username}`,
			icon: FaUser,
			outlineIcon: FaRegUser,
			label: "Profile",
			emoji: "👤",
		},
		{
			path: "/bookmarks",
			icon: FaBookmark,
			outlineIcon: FaRegBookmark,
			label: "Bookmarks",
			emoji: "📌",
		},
	];

	const secondaryNavItems = [
		{ path: "/help", icon: MdHelpOutline, label: "Help & FAQ", emoji: "❓" },
	];

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="hidden md:flex md:flex-col md:w-64 pt-16 px-2 dark:bg-dark-surface/50 light:bg-light-surface/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
				{/* Logo Section */}
				<Link
					to="/"
					className="px-4 py-4 mb-6 rounded-full group transition-all hover:dark:bg-dark-card hover:light:bg-light-card"
				>
					<div className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform">
						Pulse
					</div>
					<p className="text-xs dark:text-gray-500 light:text-gray-500 mt-1">
						Feel the rhythm
					</p>
				</Link>

				{/* Primary Navigation */}
				<nav className="space-y-2 flex-1">
					{mainNavItems.map((item) => {
						const Icon = isActive(item.path) ? item.icon : item.outlineIcon;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group relative
									${
										isActive(item.path)
											? "dark:bg-dark-card dark:text-brand-primary light:bg-light-card light:text-brand-primary shadow-glow"
											: "dark:text-gray-400 light:text-gray-600 hover:dark:bg-dark-card hover:light:bg-light-card"
									}`}
							>
								<Icon className="w-6 h-6" />
								<span className="font-semibold hidden lg:inline">{item.label}</span>
								{isActive(item.path) && (
									<div className="ml-auto w-1.5 h-1.5 rounded-full dark:bg-brand-primary bg-brand-primary animate-pulse-glow" />
								)}
							</Link>
						);
					})}
				</nav>

				{/* Secondary Navigation */}
				<div className="space-y-2 border-t dark:border-dark-border border-light-border pt-4 mb-4">
					{secondaryNavItems.map((item, i) => (
						<Link
							key={i}
							to={item.path}
							className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200
								${
									isActive(item.path)
										? "dark:bg-dark-card dark:text-brand-primary light:bg-light-card light:text-brand-primary"
										: "dark:text-gray-400 light:text-gray-600 hover:dark:bg-dark-card hover:light:bg-light-card"
								}`}
						>
							<item.icon className="w-6 h-6" />
							<span className="font-semibold hidden lg:inline">{item.label}</span>
						</Link>
					))}
				</div>

				{/* Compose Button - Desktop */}
				<Link
					to="/"
					className="hidden lg:flex lg:w-full btn-primary py-3 gap-2 justify-center items-center mb-4 font-bold text-lg"
				>
					<BiSolidMessageSquareAdd className="w-5 h-5" />
					Compose
				</Link>

				{/* User Profile Card */}
				{authUser && (
					<div className="border-t dark:border-dark-border border-light-border pt-4">
						<Link
							to={`/profile/${authUser.username}`}
							className="card-base p-3 flex gap-3 hover:shadow-glow group mb-3 transition-all"
						>
							<img
								src={authUser.profileImg || "/avatar-placeholder.png"}
								alt={authUser.fullName}
								className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-brand-primary transition-all flex-shrink-0"
							/>
							<div className="flex-1 min-w-0 hidden lg:block">
								<p className="font-bold text-sm truncate">{authUser.fullName}</p>
								<p className="dark:text-gray-400 light:text-gray-600 text-xs truncate">
									@{authUser.username}
								</p>
								<p className="text-xs dark:text-gray-500 light:text-gray-500 mt-1">
									{authUser.followers?.length || 0} followers
								</p>
							</div>
						</Link>

						{/* Logout Button */}
						<button
							onClick={() => logout()}
							className="w-full flex items-center justify-center lg:justify-start gap-2 px-4 py-3 dark:text-red-400 light:text-red-600 hover:dark:bg-red-900/20 hover:light:bg-red-100/20 rounded-full transition-all duration-200 border dark:border-red-800/30 light:border-red-300/30"
						>
							<BiLogOut className="w-5 h-5" />
							<span className="hidden lg:inline text-sm font-semibold">Logout</span>
						</button>
					</div>
				)}
			</aside>

			{/* Mobile Bottom Navigation */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 dark:bg-dark-surface bg-white border-t dark:border-dark-border border-light-border z-50">
				<div className="flex justify-around px-4 py-3">
					{mainNavItems.slice(0, 3).map((item) => {
						const Icon = isActive(item.path) ? item.icon : item.outlineIcon;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`p-3 rounded-full transition-all duration-200 ${
									isActive(item.path)
										? "dark:bg-dark-card dark:text-brand-primary light:bg-light-card light:text-brand-primary"
										: "dark:text-gray-400 light:text-gray-600 hover:dark:text-brand-primary hover:light:text-brand-primary"
								}`}
							>
								<Icon className="w-6 h-6" />
							</Link>
						);
					})}

					{/* Quick Add Post Button */}
					<Link
						to="/"
						className="p-3 rounded-full dark:bg-brand-primary bg-brand-primary text-white hover:dark:bg-brand-primary-hover hover:light:bg-brand-primary-hover transition-all active:scale-95"
						title="Compose post"
					>
						<BiSolidMessageSquareAdd className="w-6 h-6" />
					</Link>

					{/* Bookmarks on Mobile */}
					<Link
						to="/bookmarks"
						className={`p-3 rounded-full transition-all duration-200 ${
							isActive("/bookmarks")
								? "dark:bg-dark-card dark:text-brand-primary light:bg-light-card light:text-brand-primary"
								: "dark:text-gray-400 light:text-gray-600 hover:dark:text-brand-primary hover:light:text-brand-primary"
						}`}
					>
						{/* Use the correct icon based on active state */}
						{isActive("/bookmarks") ? (
							<FaBookmark className="w-6 h-6" />
						) : (
							<FaRegBookmark className="w-6 h-6" />
						)}
					</Link>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
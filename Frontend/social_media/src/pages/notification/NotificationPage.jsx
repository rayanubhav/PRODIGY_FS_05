import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUser, FaHeart, FaTrash } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const NotificationPage = () => {
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const res = await fetch("/api/notifications");
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to load notifications");
			return data;
		},
	});

	const { mutate: deleteNotifications, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/notifications", { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
		onSuccess: () => {
			toast.success("Notifications cleared ✨");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	return (
		<div className="flex-1">
			{/* Header */}
			<div className="sticky top-16 md:top-0 dark:bg-dark-surface/80 light:bg-white/80 backdrop-blur-lg border-b dark:border-dark-border border-light-border z-10">
				<div className="flex items-center justify-between px-4 py-4">
					<div>
						<h1 className="text-2xl font-bold">🔔 Notifications</h1>
						<p className="dark:text-gray-400 light:text-gray-600 text-sm">
							{notifications?.length || 0} unread
						</p>
					</div>
					<div className="dropdown dropdown-end">
						<button
							tabIndex={0}
							className="p-2 rounded-full dark:hover:bg-dark-card light:hover:bg-light-surface transition-colors"
						>
							<IoSettingsOutline className="w-5 h-5" />
						</button>
						<ul
							tabIndex={0}
							className="dropdown-content z-[1] menu p-2 shadow dark:bg-dark-card light:bg-light-card rounded-lg w-52 dark:border dark:border-dark-border light:border light:border-light-border"
						>
							<li>
								<button
									onClick={() => deleteNotifications()}
									disabled={isDeleting}
									className="flex items-center gap-2"
								>
									{isDeleting ? <LoadingSpinner size="xs" /> : <FaTrash className="w-4 h-4" />}
									Clear All
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-2xl mx-auto">
				{isLoading && (
					<div className="flex justify-center items-center py-20">
						<LoadingSpinner size="lg" />
					</div>
				)}

				{!isLoading && notifications?.length === 0 && (
					<div className="card-base m-3 p-8 text-center animate-fade-in">
						<div className="text-5xl mb-4">📭</div>
						<h3 className="text-lg font-semibold mb-2">All caught up!</h3>
						<p className="dark:text-gray-400 light:text-gray-600">
							You don't have any notifications yet
						</p>
					</div>
				)}

				{!isLoading &&
					notifications?.map((notification) => (
						<Link
							key={notification._id}
							to={`/profile/${notification.from.username}`}
							className="no-hover"
						>
							<article className="card-base m-3 p-4 hover:shadow-glow cursor-pointer group animate-fade-in">
								<div className="flex gap-4 items-start">
									{/* Icon */}
									<div
										className={`flex-shrink-0 p-3 rounded-full ${
											notification.type === "follow"
												? "dark:bg-blue-900/30 light:bg-blue-100/30"
												: "dark:bg-red-900/30 light:bg-red-100/30"
										}`}
									>
										{notification.type === "follow" ? (
											<FaUser className="w-5 h-5 dark:text-blue-400 light:text-blue-600" />
										) : (
											<FaHeart className="w-5 h-5 text-red-500 animate-heart-bounce" />
										)}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0">
										<div className="flex gap-3 items-start">
											<img
												src={
													notification.from.profileImg || "/avatar-placeholder.png"
												}
												alt={notification.from.fullName}
												className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-brand-primary transition-all"
											/>
											<div className="flex-1">
												<p className="font-semibold">
													{notification.from.fullName}
													<span className="dark:text-gray-400 light:text-gray-600">
														{" "}
														@{notification.from.username}
													</span>
												</p>
												<p className="dark:text-gray-300 light:text-gray-700 mt-1">
													{notification.type === "follow"
														? "👥 started following you"
														: "❤️ liked your post"}
												</p>
												<p className="dark:text-gray-500 light:text-gray-500 text-xs mt-2">
													{new Date(notification.createdAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														}
													)}
												</p>
											</div>
										</div>
									</div>

									{/* Status Indicator */}
									{!notification.read && (
										<div className="w-2 h-2 rounded-full dark:bg-brand-primary bg-brand-primary flex-shrink-0 mt-2" />
									)}
								</div>
							</article>
						</Link>
					))}
			</div>
		</div>
	);
};

export default NotificationPage;
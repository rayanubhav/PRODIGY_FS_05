import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MdHomeFilled, MdOutlineHome } from "react-icons/md";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { FaUser, FaRegUser } from "react-icons/fa";
import { BiSolidMessageSquareAdd, BiMessageSquareAdd } from "react-icons/bi";

const BottomNav = () => {
	const location = useLocation();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const isActive = (path) => location.pathname === path;

	const navItems = [
		{ path: "/", icon: MdHomeFilled, outlineIcon: MdOutlineHome, label: "Home" },
		{
			path: "/notifications",
			icon: IoNotifications,
			outlineIcon: IoNotificationsOutline,
			label: "Notifications",
		},
		{
			path: `/profile/${authUser?.username}`,
			icon: FaUser,
			outlineIcon: FaRegUser,
			label: "Profile",
		},
	];

	return (
		<div className="fixed bottom-0 left-0 right-0 md:hidden dark:bg-dark-surface bg-white border-t dark:border-dark-border border-light-border glass z-40">
			<div className="flex justify-around items-center px-4 py-3">
				{navItems.map((item) => {
					const Icon = isActive(item.path) ? item.icon : item.outlineIcon;
					return (
						<Link
							key={item.path}
							to={item.path}
							className={`p-3 rounded-full transition-all duration-200 ${
								isActive(item.path)
									? "dark:bg-dark-card dark:text-brand-primary light:bg-light-surface light:text-brand-primary"
									: "dark:text-gray-400 light:text-gray-600 hover:dark:text-brand-primary hover:light:text-brand-primary"
							}`}
						>
							<Icon className="w-6 h-6" />
						</Link>
					);
				})}
				<button className="p-3 rounded-full dark:bg-brand-primary bg-brand-primary text-white hover:dark:bg-brand-primary-hover hover:light:bg-brand-primary-hover transition-all duration-200 active:scale-95">
					<BiSolidMessageSquareAdd className="w-6 h-6" />
				</button>
			</div>
		</div>
	);
};

export default BottomNav;
import { useTheme } from "../../contexts/ThemeContext";
import { MdOutlineWbSunny, MdOutlineNightlight } from "react-icons/md";

const Navbar = () => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 h-16 dark:bg-dark-surface bg-white border-b dark:border-dark-border border-light-border glass">
			<div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
				<div className="text-2xl font-bold gradient-text">Pulse</div>

				<button
					onClick={toggleTheme}
					className="btn-ghost p-2 rounded-full hover:dark:bg-dark-card hover:light:bg-light-surface"
					aria-label="Toggle theme"
				>
					{isDark ? (
						<MdOutlineWbSunny className="w-6 h-6 text-brand-accent" />
					) : (
						<MdOutlineNightlight className="w-6 h-6 text-brand-primary" />
					)}
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
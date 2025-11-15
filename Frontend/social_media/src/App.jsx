import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home/HomePage.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

import Navbar from "./components/common/Navbar.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import BookmarksPage from "./pages/bookmarks/BookmarksPage.jsx";
import HelpPage from "./pages/help/HelpPage.jsx";

function AppContent() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<div className="h-screen flex justify-center items-center dark:bg-dark-bg bg-white">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<>
			{authUser && <Navbar />}
			<div className="flex min-h-screen dark:bg-dark-bg bg-white">
				{authUser && <Sidebar />}
				{/* This main tag centralizes page layout padding for all pages */}
				<main className="flex-1 pt-16 pb-20 md:pb-0">
					<Routes>
						<Route
							path="/"
							element={authUser ? <HomePage /> : <Navigate to="/login" />}
						/>
						<Route
							path="/login"
							element={!authUser ? <LoginPage /> : <Navigate to="/" />}
						/>
						<Route
							path="/signup"
							element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
						/>
						<Route
							path="/notifications"
							element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
						/>
						<Route
							path="/profile/:username"
							element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
						/>
						<Route
							path="/bookmarks"
							element={authUser ? <BookmarksPage /> : <Navigate to="/login" />}
						/>
						<Route path="/help" element={<HelpPage />} />
					</Routes>
				</main>
				{authUser && <RightPanel />}
			</div>
			{/* This BottomNav is duplicated by Sidebar.jsx, so we remove it. */}
			{/* {authUser && <BottomNav />} */}
			<Toaster position="top-right" />
		</>
	);
}

function App() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}

export default App;
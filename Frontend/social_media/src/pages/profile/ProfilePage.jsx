import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { formatMemberSinceDate } from "../../utils/index.js";
import Posts from "../../components/common/Posts.jsx";
import EditProfileModal from "./EditProfileModal.jsx";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton.jsx";
import useFollow from "../../hooks/useFollow.js";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile.jsx";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);
	const { username } = useParams();

	const { follow, isPending: isFollowing } = useFollow();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile", username],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/users/profile/${username.toLowerCase()}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
	});

	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();
	const isMyProfile = authUser?._id === user?._id;
	const memberSinceDate = user?.createdAt ? formatMemberSinceDate(user.createdAt) : "";
	const amIFollowing = authUser?.following.includes(user?._id);

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	if (isLoading || isRefetching) return <ProfileHeaderSkeleton />;
	if (!user)
		return (
			<div className="flex-1 flex items-center justify-center">
				<p className="text-lg">👤 User not found</p>
			</div>
		);

	return (
		<div className="flex-1">
			{/* Back Button - Mobile */}
			<div className="sticky top-16 md:top-0 dark:bg-dark-surface/80 light:bg-white/80 backdrop-blur-lg border-b dark:border-dark-border border-light-border z-10 px-4 py-3 flex md:hidden">
				<Link to="/" className="flex items-center gap-2 group">
					<FaArrowLeft className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
					<p className="font-bold">{user?.fullName}</p>
				</Link>
			</div>

			{/* Cover Image Section */}
			<div className="relative group/cover bg-dark-surface/50">
				{/* Cover Image - Fixed Height */}
				<div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-brand-primary/10 to-brand-accent/10">
					<img
						src={coverImg || user?.coverImg || "/cover.png"}
						alt="Cover"
						className="w-full h-full object-cover"
					/>

					{/* Edit Button - VISIBLE & ACCESSIBLE */}
					{isMyProfile && (
						<button
							onClick={() => coverImgRef.current?.click()}
							className="absolute top-3 right-3 p-2.5 dark:bg-dark-surface/90 light:bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover/cover:opacity-100 transition-opacity hover:dark:bg-brand-primary hover:light:bg-brand-primary hover:text-white shadow-lg z-20"
							title="Edit cover image"
						>
							<MdEdit className="w-5 h-5" />
						</button>
					)}
				</div>

				{/* Profile Info Card - Below Cover */}
				<div className="px-4 pt-16 pb-6 dark:bg-dark-surface light:bg-light-surface">
					{/* Profile Picture */}
					<div className="flex flex-col md:flex-row md:items-end gap-4">
						<div className="relative -mt-20 group/avatar flex-shrink-0">
							<img
								src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
								alt={user?.fullName}
								className="w-32 h-32 rounded-full object-cover border-4 dark:border-dark-surface light:border-light-surface ring-2 ring-brand-primary/20"
							/>
							{isMyProfile && (
								<button
									onClick={() => profileImgRef.current?.click()}
									className="absolute bottom-2 right-2 p-2 dark:bg-brand-primary light:bg-brand-primary rounded-full text-white hover:dark:bg-brand-primary-hover hover:light:bg-brand-primary-hover transition-all active:scale-95 shadow-lg"
									title="Edit profile picture"
								>
									<MdEdit className="w-4 h-4" />
								</button>
							)}
						</div>

						{/* User Info & Buttons */}
						<div className="flex-1">
							<h1 className="text-3xl font-bold mb-1">{user?.fullName}</h1>
							<p className="dark:text-gray-400 light:text-gray-600 mb-4">@{user?.username}</p>

							{/* Action Buttons */}
							<div className="flex gap-2 flex-wrap">
								{isMyProfile && <EditProfileModal authUser={authUser} />}
								{!isMyProfile && (
									<button
										onClick={() => follow(user?._id)}
										disabled={isFollowing}
										className="btn-primary text-sm"
									>
										{isFollowing ? "Loading..." : amIFollowing ? "👥 Unfollow" : "👤 Follow"}
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										onClick={async () => {
											await updateProfile({ coverImg, profileImg });
											setCoverImg(null);
											setProfileImg(null);
										}}
										disabled={isUpdatingProfile}
										className="btn-primary text-sm"
									>
										{isUpdatingProfile ? "💾 Saving..." : "✨ Save Changes"}
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Bio Section */}
					{user?.bio && (
						<p className="dark:text-gray-300 light:text-gray-700 mt-4 mb-4">
							{user.bio}
						</p>
					)}

					{/* Links & Date */}
					<div className="flex flex-col sm:flex-row gap-3 text-sm dark:text-gray-400 light:text-gray-600">
						{user?.link && (
							<a
								href={user.link}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-1 hover:text-brand-accent transition-colors group"
								title={user.link}
							>
								<FaLink className="w-4 h-4" />
								<span className="truncate group-hover:underline">
									{user.link.replace(/^https?:\/\/(www\.)?/, "")}
								</span>
							</a>
						)}
						<div className="flex items-center gap-1">
							<IoCalendarOutline className="w-4 h-4 flex-shrink-0" />
							<span>{memberSinceDate}</span>
						</div>
					</div>

					{/* Stats */}
					<div className="flex gap-6 mt-4 pt-4 border-t dark:border-dark-border border-light-border">
						<button className="hover:text-brand-primary transition-colors group cursor-default">
							<span className="font-bold text-lg">{user?.following?.length || 0}</span>
							<p className="text-xs dark:text-gray-500 light:text-gray-500 group-hover:text-brand-primary">
								Following
							</p>
						</button>
						<button className="hover:text-brand-primary transition-colors group cursor-default">
							<span className="font-bold text-lg">{user?.followers?.length || 0}</span>
							<p className="text-xs dark:text-gray-500 light:text-gray-500 group-hover:text-brand-primary">
								Followers
							</p>
						</button>
					</div>
				</div>
			</div>

			{/* Feed Tabs */}
			<div className="sticky top-16 md:top-0 dark:bg-dark-surface/80 light:bg-white/80 backdrop-blur-lg border-b dark:border-dark-border border-light-border z-10 px-4">
				<div className="flex gap-8">
					{[
						{ id: "posts", label: "📝 Posts" },
						{ id: "likes", label: "❤️ Likes" },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setFeedType(tab.id)}
							className={`py-4 font-semibold transition-all duration-200 relative
								${
									feedType === tab.id
										? "dark:text-brand-primary light:text-brand-primary"
										: "dark:text-gray-500 light:text-gray-500"
								}`}
						>
							{tab.label}
							{feedType === tab.id && (
								<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full" />
							)}
						</button>
					))}
				</div>
			</div>

			{/* Hidden File Inputs */}
			<input
				type="file"
				hidden
				accept="image/*"
				ref={coverImgRef}
				onChange={(e) => handleImgChange(e, "coverImg")}
			/>
			<input
				type="file"
				hidden
				accept="image/*"
				ref={profileImgRef}
				onChange={(e) => handleImgChange(e, "profileImg")}
			/>

			{/* Posts Feed */}
			<Posts feedType={feedType} username={username} userId={user?._id} />
		</div>
	);
};

export default ProfilePage;
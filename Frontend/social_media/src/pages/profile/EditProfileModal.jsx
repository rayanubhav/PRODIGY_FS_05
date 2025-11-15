import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio || "",
				link: authUser.link || "",
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Wait for the update to complete
			await updateProfile(formData);
			// Only close modal on success
			document.getElementById("edit_profile_modal")?.close();
		} catch (error) {
			// Error is already handled by useUpdateUserProfile hook's toast
			console.error("Failed to update profile:", error);
		}
	};

	return (
		<>
			<button className="btn-primary" onClick={() => document.getElementById("edit_profile_modal")?.showModal()}>
				✏️ Edit Profile
			</button>

			<dialog id="edit_profile_modal" className="modal">
				<div className="modal-box card-base dark:border-dark-border light:border-light-border w-full max-w-md">
					{/* Header */}
					<div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-dark-border border-light-border">
						<h3 className="text-2xl font-bold">✏️ Edit Profile</h3>
						<button
							onClick={() => document.getElementById("edit_profile_modal")?.close()}
							className="p-2 rounded-full hover:dark:bg-dark-surface hover:light:bg-light-surface transition-colors"
							aria-label="Close"
						>
							<MdClose className="w-6 h-6" />
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
						{/* Full Name */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Full Name
							</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleInputChange}
								placeholder="Your full name"
								className="input-base"
							/>
						</div>

						{/* Username */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Username
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								placeholder="username"
								className="input-base"
							/>
						</div>

						{/* Email */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Email Address
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="you@example.com"
								className="input-base"
							/>
						</div>

						{/* Bio */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Bio
							</label>
							<textarea
								name="bio"
								value={formData.bio}
								onChange={handleInputChange}
								placeholder="Tell us about yourself..."
								maxLength={160}
								rows={3}
								className="input-base resize-none"
							/>
							<p className="text-xs dark:text-gray-500 light:text-gray-500 mt-1">
								{formData.bio.length}/160
							</p>
						</div>

						{/* Link */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Website
							</label>
							<input
								type="url"
								name="link"
								value={formData.link}
								onChange={handleInputChange}
								placeholder="https://example.com"
								className="input-base"
							/>
						</div>

						{/* Divider */}
						<div className="my-4 pt-4 border-t dark:border-dark-border border-light-border">
							<p className="text-sm font-semibold dark:text-gray-300 light:text-gray-700 mb-3">
								🔒 Change Password (Optional)
							</p>
						</div>

						{/* Current Password */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								Current Password
							</label>
							<input
								type="password"
								name="currentPassword"
								value={formData.currentPassword}
								onChange={handleInputChange}
								placeholder="Enter current password"
								className="input-base"
							/>
						</div>

						{/* New Password */}
						<div>
							<label className="block dark:text-gray-300 light:text-gray-700 text-sm font-medium mb-2">
								New Password
							</label>
							<input
								type="password"
								name="newPassword"
								value={formData.newPassword}
								onChange={handleInputChange}
								placeholder="Enter new password"
								className="input-base"
							/>
						</div>

						{/* Buttons */}
						<div className="flex gap-2 mt-6 pt-4 border-t dark:border-dark-border border-light-border">
							<button
								type="button"
								onClick={() => document.getElementById("edit_profile_modal")?.close()}
								className="btn-secondary flex-1"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isUpdatingProfile}
								className="btn-primary flex-1"
							>
								{isUpdatingProfile ? "💾 Saving..." : "✨ Save"}
							</button>
						</div>
					</form>
				</div>

				{/* Backdrop */}
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;
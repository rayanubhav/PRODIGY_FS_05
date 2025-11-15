import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaChevronDown, FaSearch } from "react-icons/fa";
import { MdHelpOutline } from "react-icons/md";

const HelpPage = () => {
	const [expanded, setExpanded] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	const faqs = [
		{
			id: 1,
			category: "Getting Started",
			question: "How do I create my first post?",
			answer:
				"Tap the 'What's on your mind?' box, type your message, optionally add an image or emoji, then tap 'Post'. Your post appears instantly in the feed!",
		},
		{
			id: 2,
			category: "Getting Started",
			question: "How do I follow someone?",
			answer:
				"Go to their profile and click 'Follow'. Their posts will then appear in your 'Following' feed. You can see suggested users to follow on the home page.",
		},
		{
			id: 3,
			category: "Features",
			question: "What's the difference between 'For You' and 'Following'?",
			answer:
				"'For You' shows posts from everyone and trending content. 'Following' shows only posts from people you follow.",
		},
		{
			id: 4,
			category: "Features",
			question: "How do I like a post?",
			answer:
				"Click the heart icon (❤️) on any post to like it. The heart turns red and the like count increases.",
		},
		{
			id: 5,
			category: "Features",
			question: "How do I comment on a post?",
			answer:
				"Click the comment icon (💬) to open the comments section. Type your comment and click 'Post' to share it.",
		},
		{
			id: 6,
			category: "Bookmarks",
			question: "How do I bookmark a post?",
			answer:
				"Click the bookmark icon (📌) on any post to save it. Visit the Bookmarks section from the sidebar to view all saved posts.",
		},
		{
			id: 7,
			category: "Profile",
			question: "How do I edit my profile?",
			answer:
				"Go to your profile page and click 'Edit Profile'. Update your name, bio, profile picture, cover image, and website link.",
		},
		{
			id: 8,
			category: "Profile",
			question: "How do I delete a post?",
			answer:
				"Hover over your own post to see the delete icon (🗑️). Click it to remove your post permanently.",
		},
		{
			id: 9,
			category: "Appearance",
			question: "How do I switch between dark and light mode?",
			answer:
				"Click the sun/moon icon (☀️/🌙) in the top-right corner of the navigation bar to toggle between dark and light mode.",
		},
		{
			id: 10,
			category: "Tips & Tricks",
			question: "How can I make my posts more discoverable?",
			answer:
				"Use hashtags (#) to categorize your posts. Engage with other posts by liking and commenting. Quality content gets more visibility!",
		},
	];

	// Filter FAQs based on search
	const filteredFaqs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Group by category
	const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
		const category = acc.find((g) => g.category === faq.category);
		if (category) {
			category.items.push(faq);
		} else {
			acc.push({ category: faq.category, items: [faq] });
		}
		return acc;
	}, []);

	const toggleExpanded = (id) => {
		setExpanded(expanded === id ? null : id);
	};

	return (
		<div className="flex-1">
			{/* Header */}
			<div className="sticky top-16 md:top-0 dark:bg-dark-surface/80 light:bg-white/80 backdrop-blur-lg border-b dark:border-dark-border border-light-border z-10 px-4 py-4 flex items-center gap-4">
				<Link to="/" className="flex items-center gap-2 group">
					<FaArrowLeft className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
				</Link>
				<p className="font-bold text-lg">Help & FAQ</p>
			</div>

			{/* Content */}
			<div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
				{/* Hero Section */}
				<div className="card-base p-6 mb-6 text-center animate-fade-in">
					<MdHelpOutline className="w-12 h-12 mx-auto text-brand-primary mb-3" />
					<h2 className="text-2xl font-bold mb-2">How can we help?</h2>
					<p className="dark:text-gray-400 light:text-gray-600">
						Find answers to common questions about Pulse
					</p>
				</div>

				{/* Search Bar */}
				<div className="card-base p-3 flex items-center gap-3 mb-6">
					<FaSearch className="text-brand-accent flex-shrink-0" />
					<input
						type="text"
						placeholder="Search questions..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="flex-1 bg-transparent dark:text-white light:text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
					/>
				</div>

				{/* No Results */}
				{filteredFaqs.length === 0 && (
					<div className="card-base p-8 text-center">
						<p className="dark:text-gray-400 light:text-gray-600">
							No results found. Try a different search term.
						</p>
					</div>
				)}

				{/* FAQ Items Grouped by Category */}
				{groupedFaqs.map((group) => (
					<div key={group.category} className="mb-6">
						{/* Category Header */}
						<h3 className="text-sm font-bold text-brand-primary mb-3 uppercase tracking-wider">
							{group.category}
						</h3>

						{/* FAQ Items */}
						<div className="space-y-2">
							{group.items.map((faq) => (
								<div
									key={faq.id}
									className="card-base p-4 cursor-pointer hover:dark:bg-dark-surface hover:light:bg-light-surface transition-colors group"
									onClick={() => toggleExpanded(faq.id)}
								>
									<div className="flex items-center justify-between gap-3">
										<h4 className="font-semibold text-sm flex-1 group-hover:text-brand-primary transition-colors text-left">
											{faq.question}
										</h4>
										<FaChevronDown
											className={`w-4 h-4 text-brand-primary transition-transform duration-300 flex-shrink-0 ${
												expanded === faq.id ? "rotate-180" : ""
											}`}
										/>
									</div>

									{/* Answer - Expanded */}
									{expanded === faq.id && (
										<div className="mt-3 pt-3 border-t dark:border-dark-border border-light-border animate-fade-in">
											<p className="dark:text-gray-300 light:text-gray-700 text-sm leading-relaxed">
												{faq.answer}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				))}

				{/* Tips Section */}
				<div className="card-base p-6 mt-8 dark:bg-brand-primary/10 light:bg-brand-primary/10 border dark:border-brand-primary/20 light:border-brand-primary/20">
					<h3 className="text-lg font-bold mb-4 flex items-center gap-2">
						💡 Quick Tips
					</h3>
					<ul className="space-y-3 text-sm">
						<li className="flex gap-3">
							<span className="text-brand-primary flex-shrink-0">✨</span>
							<span>
								Use <strong>hashtags (#)</strong> to categorize your posts and make them
								discoverable
							</span>
						</li>
						<li className="flex gap-3">
							<span className="text-brand-primary flex-shrink-0">🎨</span>
							<span>
								Add <strong>emojis</strong> to your posts to make them more engaging
							</span>
						</li>
						<li className="flex gap-3">
							<span className="text-brand-primary flex-shrink-0">📌</span>
							<span>
								<strong>Bookmark</strong> posts you want to read later from your browser
							</span>
						</li>
						<li className="flex gap-3">
							<span className="text-brand-primary flex-shrink-0">👥</span>
							<span>
								<strong>Follow</strong> creators whose content you enjoy to personalize
								your feed
							</span>
						</li>
						<li className="flex gap-3">
							<span className="text-brand-primary flex-shrink-0">🌙</span>
							<span>
								Toggle <strong>dark/light mode</strong> in the top-right corner anytime
							</span>
						</li>
						<li className="flex gap-3">
							<span className="text-brand-primary flex-shrink-0">💬</span>
							<span>
								Engage with posts through <strong>comments</strong> to build community
							</span>
						</li>
					</ul>
				</div>

				{/* Contact Section */}
				<div className="card-base p-6 mt-8 text-center">
					<h3 className="text-lg font-bold mb-2">Still need help?</h3>
					<p className="dark:text-gray-400 light:text-gray-600 mb-4 text-sm">
						Can't find the answer you're looking for?
					</p>
					<button className="btn-primary">📧 Contact Support</button>
				</div>

				{/* Shortcuts Info */}
				<div className="card-base p-4 mt-8 dark:bg-dark-surface/50 light:bg-light-surface/50 text-xs dark:text-gray-400 light:text-gray-600">
					<p className="font-semibold mb-2">⌨️ Coming Soon: Keyboard Shortcuts</p>
					<p>We're adding keyboard shortcuts to make Pulse even easier to use.</p>
				</div>
			</div>
		</div>
	);
};

export default HelpPage;
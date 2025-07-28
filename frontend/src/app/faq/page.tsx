"use client";
import { useState } from "react";

const faqs = [
	{
		question: "What products do you sell?",
		answer:
			"We offer a wide range of computers, components, electronics, and accessories from top brands for all your tech needs. Whether you're a gamer, professional, or student, you'll find the latest laptops, desktops, PC parts, peripherals, and more.",
	},
	{
		question: "Do you offer in-store pickup?",
		answer:
			"Absolutely! You can order online and pick up your items at any of our retail locations across Canada. Our Click & Collect service is fast, convenient, and free.",
	},
	{
		question: "How can I track my order?",
		answer:
			"Once your order ships, you'll receive a tracking number by email. You can also view your order status and history in your account dashboard for real-time updates.",
	},
	{
		question: "What is your return policy?",
		answer:
			"We offer a 30-day return policy on most items. If you're not satisfied, simply visit our Returns & Exchanges page or contact our support team for a smooth return process.",
	},
	{
		question: "How do I contact customer support?",
		answer:
			"You can reach us via our Contact Us page, email (support@canadacomputers.com), or by phone at (555) 123-4567. Our team is here to help 7 days a week!",
	},
	{
		question: "Do you offer price matching?",
		answer:
			"Yes! We offer price matching on eligible products. If you find a lower price at a qualifying retailer, let us know and we'll match it.",
	},
	{
		question: "Are there any student or business discounts?",
		answer:
			"We offer exclusive discounts for students, educators, and businesses. Contact us to learn more about our special programs and bulk pricing.",
	},
];

export default function FAQPage() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-16 px-2">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-5xl font-extrabold text-blue-700 mb-8 text-center drop-shadow-lg">
					Frequently Asked Questions
				</h1>
				<div className="bg-white/80 rounded-2xl shadow-2xl p-10 space-y-6 border border-blue-100">
					{faqs.map((faq, idx) => (
						<div key={faq.question} className="transition-all duration-300">
							<button
								className={`w-full flex justify-between items-center text-left py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 group ${
									openIndex === idx
										? "bg-blue-50"
										: "bg-white hover:bg-blue-50"
								}`}
								onClick={() =>
									setOpenIndex(openIndex === idx ? null : idx)
								}
								aria-expanded={openIndex === idx}
							>
								<span className="text-xl font-semibold text-blue-700 group-hover:text-blue-900 transition">
									{faq.question}
								</span>
								<svg
									className={`w-6 h-6 text-blue-400 transform transition-transform duration-300 ${
										openIndex === idx ? "rotate-180" : ""
									}`}
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div
								className={`overflow-hidden transition-all duration-300 ${
									openIndex === idx
										? "max-h-40 opacity-100 py-2 px-6"
										: "max-h-0 opacity-0 py-0 px-6"
								}`}
								aria-hidden={openIndex !== idx}
							>
								<p className="text-gray-700 text-lg leading-relaxed">
									{faq.answer}
								</p>
							</div>
						</div>
					))}
				</div>
				<div className="mt-12 text-center">
					<span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium shadow">
						Still have questions?{" "}
						<a
							href="/contact"
							className="underline hover:text-blue-900"
						>
							Contact us
						</a>
					</span>
				</div>
			</div>
		</div>
	);
}

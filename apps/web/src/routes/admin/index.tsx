// biome-ignore-all lint/performance/noJsxPropsBind: Dashboard controls use local navigation and UI state.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workholo/ui/components/card";
import {
	ArrowDownLeft,
	CalendarDays,
	ChevronDown,
	CreditCard,
	PhoneCall,
	WalletCards,
} from "lucide-react";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

const faqs = [
	{
		question:
			"Will my customer be automatically connected to the same agent he spoke with earlier?",
		answer:
			"Yes. If the same agent is available, the customer can be routed back to that agent based on the configured call routing settings.",
	},
	{
		question:
			"Does Acefone provide SMS or Email notifications for when an agent misses a call?",
		answer:
			"Yes. SMS and Email notifications can be configured for missed calls so that the required users or agents are notified.",
	},
	{
		question: "Does Acefone provide auto-charge facility?",
		answer:
			"Yes. Auto-charge can be enabled to automatically recharge the account when the available balance reaches the configured threshold.",
	},
];

function AdminDashboard() {
	const navigate = useNavigate();
	const [openFaq, setOpenFaq] = useState<string | null>(null);

	return (
		<div className="flex min-h-svh flex-col bg-[#eef3f9] dark:bg-slate-950">
			<AdminTopbar />

			<main className="flex-1 p-4 md:p-6">
				<div className="mx-auto max-w-[1500px]">
					<div className="grid gap-4 xl:grid-cols-2">
						{/* ================================
						    LIVE DATA
						================================ */}
						<Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<CardHeader className="border-slate-100 border-b px-5 py-4 dark:border-slate-800">
								<div className="flex items-center gap-2">
									<span className="h-5 w-1 rounded-full bg-[#0757ff] dark:bg-blue-500" />

									<CardTitle className="font-semibold text-[#102b55] text-sm dark:text-white">
										Live Data
									</CardTitle>
								</div>
							</CardHeader>

							<CardContent className="p-5">
								<div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800">
									{/* Active Calls */}
									<div className="flex flex-col items-center gap-2 px-3 text-center">
										<div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400">
											<PhoneCall className="size-5" />
										</div>

										<span className="font-bold text-2xl text-[#102b55] dark:text-white">
											8
										</span>

										<span className="text-slate-500 text-xs dark:text-slate-400">
											Active Calls
										</span>
									</div>

									{/* Missed Calls */}
									<div className="flex flex-col items-center gap-2 px-3 text-center">
										<div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
											<ArrowDownLeft className="size-5" />
										</div>

										<span className="flex items-center gap-1 font-bold text-2xl text-[#102b55] dark:text-white">
											42
											<span className="text-orange-500 text-sm">↻</span>
										</span>

										<span className="text-slate-500 text-xs dark:text-slate-400">
											Total Missed Calls
										</span>
									</div>

									{/* Answered Calls */}
									<div className="flex flex-col items-center gap-2 px-3 text-center">
										<div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
											<PhoneCall className="size-5" />
										</div>

										<span className="flex items-center gap-1 font-bold text-2xl text-[#102b55] dark:text-white">
											0<span className="text-orange-500 text-sm">↻</span>
										</span>

										<span className="text-slate-500 text-xs dark:text-slate-400">
											Total Answered Calls
										</span>
									</div>
								</div>

								<div className="mt-5 border-slate-100 border-t pt-3 text-xs dark:border-slate-800">
									<span className="font-semibold text-[#0757ff] dark:text-blue-400">
										Note:
									</span>{" "}
									<span className="text-slate-500 dark:text-slate-400">
										The call count displaying here represents only incoming
										calls
									</span>
								</div>
							</CardContent>
						</Card>

						{/* ================================
						    QUICK ACCESS
						================================ */}
						<Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<CardHeader className="flex flex-row items-center justify-between border-slate-100 border-b px-5 py-4 dark:border-slate-800">
								<div className="flex items-center gap-2">
									<span className="h-5 w-1 rounded-full bg-[#0757ff] dark:bg-blue-500" />

									<CardTitle className="font-semibold text-[#102b55] text-sm dark:text-white">
										Quick Access
									</CardTitle>
								</div>

								<Button
									className="h-8 rounded-lg border-slate-200 text-slate-500 text-xs hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
									size="sm"
									variant="outline"
								>
									Customize
								</Button>
							</CardHeader>

							<CardContent className="p-5">
								<div className="grid grid-cols-2 gap-4">
									<Button
										className="h-32 flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/50 text-[#0757ff] hover:bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/40"
										onClick={() =>
											navigate({
												to: "/admin/manage-did-numbers",
											})
										}
										variant="ghost"
									>
										<div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
											<span className="font-bold text-xl">⠿</span>
										</div>

										<span className="font-medium text-xs">My Numbers</span>
									</Button>

									<Button
										className="h-32 flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-600 hover:border-blue-100 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
										variant="ghost"
									>
										<div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0757ff] dark:bg-blue-950 dark:text-blue-400">
											<CreditCard className="size-5" />
										</div>

										<span className="font-medium text-xs">
											Manage Contact Groups
										</span>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* ================================
						    BILLING SUMMARY
						================================ */}
						<Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<CardHeader className="border-slate-100 border-b px-5 py-4 dark:border-slate-800">
								<div className="flex items-center gap-2">
									<span className="h-5 w-1 rounded-full bg-[#0757ff] dark:bg-blue-500" />

									<CardTitle className="font-semibold text-[#102b55] text-sm dark:text-white">
										Billing Summary
									</CardTitle>
								</div>
							</CardHeader>

							<CardContent className="p-5">
								<div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800">
									{/* Balance */}
									<div className="flex flex-col items-center gap-2 px-3 text-center">
										<div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0757ff] dark:bg-blue-950 dark:text-blue-400">
											<WalletCards className="size-5" />
										</div>

										<span className="font-bold text-[#102b55] text-lg dark:text-white">
											INR 0
										</span>

										<span className="text-slate-500 text-xs dark:text-slate-400">
											Available Balance
										</span>

										<button
											className="font-medium text-[#0757ff] text-lg hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
											type="button"
										>
											+
										</button>
									</div>

									{/* Due Charge */}
									<div className="flex flex-col items-center gap-2 px-3 text-center">
										<div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0757ff] dark:bg-blue-950 dark:text-blue-400">
											<CreditCard className="size-5" />
										</div>

										<span className="font-bold text-[#102b55] text-lg dark:text-white">
											INR 34897
										</span>

										<button
											className="text-[#0757ff] text-xs hover:underline dark:text-blue-400"
											type="button"
										>
											Due Charge
										</button>
									</div>

									{/* Billing Date */}
									<div className="flex flex-col items-center gap-2 px-3 text-center">
										<div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
											<CalendarDays className="size-5" />
										</div>

										<span className="font-bold text-[#102b55] text-lg dark:text-white">
											24-Sep-2026
										</span>

										<span className="text-slate-500 text-xs dark:text-slate-400">
											Next Billing Date
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* ================================
						    FAQ
						================================ */}
						<Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<CardHeader className="border-slate-100 border-b px-5 py-4 dark:border-slate-800">
								<div className="flex items-center gap-2">
									<span className="h-5 w-1 rounded-full bg-[#0757ff] dark:bg-blue-500" />

									<CardTitle className="font-semibold text-[#102b55] text-sm dark:text-white">
										FAQs
									</CardTitle>
								</div>
							</CardHeader>

							<CardContent className="p-0">
								<div className="divide-y divide-slate-100 dark:divide-slate-800">
									{faqs.map((faq) => {
										const isOpen = openFaq === faq.question;

										return (
											<div className="border-slate-100 border-b last:border-b-0 dark:border-slate-800" key={faq.question}>
												<button
													aria-expanded={isOpen}
													className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-800/60 ${isOpen ? "bg-blue-50/40 dark:bg-slate-800/40" : ""
														}`}
													onClick={() =>
														setOpenFaq((current) =>
															current === faq.question ? null : faq.question
														)
													}
													type="button"
												>
													<div className="flex items-start gap-3">
														<span className="mt-0.5 font-bold text-[#0757ff] dark:text-blue-400">
															•
														</span>

														<span className="font-medium text-slate-600 text-xs dark:text-slate-300">
															{faq.question}
														</span>
													</div>

													<ChevronDown
														className={`size-4 shrink-0 text-slate-400 transition-transform dark:text-slate-500 ${isOpen ? "rotate-180 text-[#0757ff] dark:text-blue-400" : ""
															}`}
													/>
												</button>

												{isOpen ? (
													<div className="px-5 pb-4 pl-12">
														<p className="text-slate-500 text-xs leading-5 dark:text-slate-400">
															{faq.answer}
														</p>
													</div>
												) : null}
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* ================================
					    FOOTER
					================================ */}
					<div className="mt-4">
						<Card className="rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<CardContent className="flex h-14 items-center justify-center gap-2 p-3">
								<span className="text-slate-400 text-xs dark:text-slate-500">
									Follow Us:
								</span>

								<span className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 font-semibold text-[#0757ff] text-xs dark:border-slate-700 dark:text-blue-400">
									in
								</span>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}

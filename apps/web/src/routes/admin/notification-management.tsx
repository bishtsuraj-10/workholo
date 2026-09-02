"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import {
	Bell,
	Check,
	Mail,
	MessageCircle,
	Phone,
	RotateCcw,
	Save,
	ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";

export const Route = createFileRoute("/admin/notification-management")({
	component: NotificationManagementPage,
});

type NotificationSettings = {
	sms: boolean;
	email: boolean;
	call: boolean;
	whatsapp: boolean;
};

type NotificationCategory = {
	id: string;
	name: string;
};

const categories: NotificationCategory[] = [
	{
		id: "products",
		name: "Products and Subscriptions",
	},
	{
		id: "renewals",
		name: "Renewals",
	},
	{
		id: "payments",
		name: "Payments and Charges",
	},
	{
		id: "due",
		name: "Due Charges",
	},
	{
		id: "monthly",
		name: "Monthly Account Summaries",
	},
	{
		id: "threshold",
		name: "Threshold",
	},
];

const defaultSettings: Record<string, NotificationSettings> = {
	products: {
		sms: true,
		email: true,
		call: false,
		whatsapp: false,
	},
	renewals: {
		sms: true,
		email: true,
		call: false,
		whatsapp: false,
	},
	payments: {
		sms: true,
		email: true,
		call: false,
		whatsapp: false,
	},
	due: {
		sms: true,
		email: true,
		call: false,
		whatsapp: false,
	},
	monthly: {
		sms: true,
		email: true,
		call: false,
		whatsapp: false,
	},
	threshold: {
		sms: true,
		email: true,
		call: false,
		whatsapp: false,
	},
};

/* ============================================================= */
/* NOTIFICATION SWITCH */
/* ============================================================= */

function NotificationSwitch({
	checked,
	disabled = false,
	onChange,
	label,
}: {
	checked: boolean;
	disabled?: boolean;
	onChange?: () => void;
	label: string;
}) {
	return (
		<button
			aria-label={label}
			aria-pressed={checked}
			className={`relative h-5 w-9 shrink-0 rounded-full transition-all duration-200 ${
				disabled
					? "cursor-not-allowed bg-slate-200 dark:bg-slate-700"
					: checked
						? "bg-[#0757ff] shadow-blue-500/20 shadow-sm"
						: "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
			}`}
			disabled={disabled}
			onClick={onChange}
			type="button"
		>
			<span
				className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
					checked ? "translate-x-4" : "translate-x-0.5"
				}`}
			/>
		</button>
	);
}

/* ============================================================= */
/* CHANNEL HEADER */
/* ============================================================= */

function ChannelHeader({
	icon: Icon,
	label,
	disabled = false,
}: {
	icon: typeof Mail;
	label: string;
	disabled?: boolean;
}) {
	return (
		<div className="flex items-center justify-center gap-2">
			<div
				className={`flex size-7 items-center justify-center rounded-md ${
					disabled
						? "bg-slate-100 text-slate-400 dark:bg-slate-800"
						: "bg-blue-50 text-[#0757ff] dark:bg-blue-950/40 dark:text-blue-400"
				}`}
			>
				<Icon className="size-3.5" />
			</div>

			<span className="font-semibold text-[11px] text-slate-600 dark:text-slate-300">
				{label}
			</span>
		</div>
	);
}

/* ============================================================= */
/* PAGE */
/* ============================================================= */

function NotificationManagementPage() {
	const [settings, setSettings] = useState(defaultSettings);

	const updateSetting = (
		categoryId: string,
		field: keyof NotificationSettings
	) => {
		setSettings((current) => ({
			...current,
			[categoryId]: {
				...current[categoryId],
				[field]: !current[categoryId][field],
			},
		}));
	};

	const enableAll = () => {
		setSettings((current) => {
			const updated = { ...current };

			for (const category of categories) {
				updated[category.id] = {
					sms: true,
					email: true,
					call: true,
					whatsapp: false,
				};
			}

			return updated;
		});
	};

	const handleCancel = () => {
		setSettings(defaultSettings);
	};

	const handleSubmit = () => {
		console.log("Notification settings:", settings);
	};

	return (
		<div className="flex min-h-svh flex-col bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />

			<main className="flex-1 p-4 md:p-5 lg:p-6">
				<div className="mx-auto w-full max-w-[1600px]">
					<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-[#0b1728]">
						{/* ================================================= */}
						{/* HEADER */}
						{/* ================================================= */}

						<div className="flex flex-col gap-3 border-slate-200 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
							<div className="flex items-center gap-3">
								<div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757ff] dark:bg-blue-950/40 dark:text-blue-400">
									<Bell className="size-4" />
								</div>

								<div>
									<h1 className="font-semibold text-[#102b55] text-sm dark:text-white">
										Notification Management
									</h1>

									<p className="mt-0.5 text-[11px] text-slate-400">
										Configure how notifications are delivered
									</p>
								</div>
							</div>

							<Button
								className="h-9 rounded-lg border border-[#0757ff] bg-white px-4 font-medium text-[#0757ff] text-xs shadow-none transition-all hover:bg-blue-50 dark:border-blue-500 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-950/30"
								onClick={enableAll}
								type="button"
							>
								<Check className="mr-1.5 size-3.5" />
								Enable All
							</Button>
						</div>

						{/* ================================================= */}
						{/* INFO BAR */}
						{/* ================================================= */}

						<div className="mx-5 mt-5 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-950/20">
							<div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-[#0757ff] shadow-sm dark:bg-blue-950/50 dark:text-blue-400">
								<ShieldCheck className="size-3.5" />
							</div>

							<div>
								<p className="font-medium text-[#102b55] text-xs dark:text-blue-100">
									Manage notification preferences
								</p>

								<p className="mt-0.5 text-[11px] text-slate-500 leading-5 dark:text-slate-400">
									Choose which communication channels should be used for each
									notification category.
								</p>
							</div>
						</div>

						{/* ================================================= */}
						{/* TABLE */}
						{/* ================================================= */}

						<div className="p-5">
							<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
								<div className="overflow-x-auto">
									<table className="w-full min-w-[900px] border-collapse text-xs">
										<thead>
											<tr className="bg-slate-50 dark:bg-slate-900/70">
												<th className="border-slate-200 border-b px-4 py-3.5 text-left font-semibold text-[10px] text-slate-500 uppercase tracking-wide dark:border-slate-800 dark:text-slate-400">
													Notification Category
												</th>

												<th className="w-[180px] border-slate-200 border-b px-3 py-3.5 text-center dark:border-slate-800">
													<ChannelHeader icon={MessageCircle} label="SMS" />
												</th>

												<th className="w-[180px] border-slate-200 border-b px-3 py-3.5 text-center dark:border-slate-800">
													<ChannelHeader icon={Mail} label="Email" />
												</th>

												<th className="w-[180px] border-slate-200 border-b px-3 py-3.5 text-center dark:border-slate-800">
													<ChannelHeader icon={Phone} label="Call" />
												</th>

												<th className="w-[200px] border-slate-200 border-b px-3 py-3.5 text-center dark:border-slate-800">
													<div className="flex flex-col items-center gap-1">
														<ChannelHeader
															disabled
															icon={MessageCircle}
															label="WhatsApp"
														/>

														<span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-[9px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
															Coming Soon
														</span>
													</div>
												</th>
											</tr>
										</thead>

										<tbody>
											{categories.map((category, index) => {
												const row = settings[category.id];

												return (
													<tr
														className="group transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-950/10"
														key={category.id}
													>
														{/* CATEGORY */}
														<td className="border-slate-100 border-b px-4 py-4 dark:border-slate-800">
															<div className="flex items-center gap-3">
																<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-[#0757ff] dark:bg-slate-900 dark:text-slate-500 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
																	{index === 0 && <Bell className="size-3.5" />}

																	{index === 1 && (
																		<RotateCcw className="size-3.5" />
																	)}

																	{index === 2 && <Save className="size-3.5" />}

																	{index === 3 && (
																		<ShieldCheck className="size-3.5" />
																	)}

																	{index === 4 && <Mail className="size-3.5" />}

																	{index === 5 && (
																		<Check className="size-3.5" />
																	)}
																</div>

																<div>
																	<p className="font-medium text-slate-700 text-xs dark:text-slate-200">
																		{category.name}
																	</p>

																	<p className="mt-0.5 text-[10px] text-slate-400">
																		Notification preference
																	</p>
																</div>
															</div>
														</td>

														{/* SMS */}
														<td className="border-slate-100 border-b px-3 py-4 text-center dark:border-slate-800">
															<div className="flex justify-center">
																<NotificationSwitch
																	checked={row.sms}
																	label={`${category.name} SMS`}
																	onChange={() =>
																		updateSetting(category.id, "sms")
																	}
																/>
															</div>
														</td>

														{/* EMAIL */}
														<td className="border-slate-100 border-b px-3 py-4 text-center dark:border-slate-800">
															<div className="flex justify-center">
																<NotificationSwitch
																	checked={row.email}
																	label={`${category.name} Email`}
																	onChange={() =>
																		updateSetting(category.id, "email")
																	}
																/>
															</div>
														</td>

														{/* CALL */}
														<td className="border-slate-100 border-b px-3 py-4 text-center dark:border-slate-800">
															<div className="flex justify-center">
																<NotificationSwitch
																	checked={row.call}
																	label={`${category.name} Call`}
																	onChange={() =>
																		updateSetting(category.id, "call")
																	}
																/>
															</div>
														</td>

														{/* WHATSAPP */}
														<td className="border-slate-100 border-b px-3 py-4 text-center dark:border-slate-800">
															<div className="flex justify-center">
																<NotificationSwitch
																	checked={false}
																	disabled
																	label={`${category.name} WhatsApp`}
																/>
															</div>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>

							{/* ================================================= */}
							{/* FOOTER */}
							{/* ================================================= */}

							<div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-2 text-[11px] text-slate-400">
									<div className="size-1.5 rounded-full bg-emerald-500" />

									<span>Changes are applied when you submit.</span>
								</div>

								<div className="flex items-center justify-end gap-2">
									<Button
										className="h-9 rounded-lg border-slate-200 bg-white px-4 font-medium text-slate-600 text-xs shadow-none hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
										onClick={handleCancel}
										type="button"
										variant="outline"
									>
										<RotateCcw className="mr-1.5 size-3.5" />
										Cancel
									</Button>

									<Button
										className="h-9 rounded-lg bg-[#0757ff] px-5 font-medium text-white text-xs shadow-blue-500/20 shadow-sm transition-all hover:bg-[#004be0] hover:shadow-blue-500/20 hover:shadow-md"
										onClick={handleSubmit}
										type="button"
									>
										<Save className="mr-1.5 size-3.5" />
										Save Changes
									</Button>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}

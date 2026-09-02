// biome-ignore-all lint/performance/noJsxPropsBind: Agent topbar controls use local UI state.

import {
	Bell,
	Building2,
	CheckCheck,
	ChevronDown,
	LogOut,
	Moon,
	RefreshCw,
	Settings,
	Sun,
	UserRound,
} from "lucide-react";
import { useState } from "react";

type AgentStatus = "Available" | "Away" | "Busy";

export function AgentTopbar() {
	const [isDark, setIsDark] = useState(false);
	const [status, setStatus] = useState<AgentStatus>("Available");

	const [statusOpen, setStatusOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [hrdOpen, setHrdOpen] = useState(false);

	const toggleTheme = () => {
		const nextTheme = !isDark;

		setIsDark(nextTheme);

		if (nextTheme) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	const statusColor =
		status === "Available"
			? "bg-emerald-500"
			: status === "Busy"
				? "bg-red-500"
				: "bg-amber-500";

	return (
		<header className="relative z-50 flex h-14 shrink-0 items-center border-slate-200 border-b bg-white px-3 shadow-sm md:px-5 dark:border-slate-800 dark:bg-slate-950">
			{/* =========================================================
			    BRAND
			========================================================= */}
			<div className="flex min-w-0 items-center gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0757ff] font-bold text-lg text-white shadow-sm">
					W
				</div>

				<div className="hidden border-slate-200 border-r pr-4 sm:block dark:border-slate-800">
					<p className="font-bold text-[#102b55] text-sm dark:text-white">
						Workholo
					</p>

					<p className="text-[9px] text-slate-400 uppercase tracking-wide">
						Agent Panel
					</p>
				</div>

				<div className="min-w-0">
					<h1 className="truncate font-semibold text-[#102b55] text-sm dark:text-white">
						Agent Dialer
					</h1>

					<p className="hidden text-[9px] text-slate-400 sm:block">
						Manage calls and leads
					</p>
				</div>
			</div>

			{/* SPACER */}
			<div className="flex-1" />

			{/* =========================================================
			    HRD / DEPARTMENT
			========================================================= */}
			<div className="relative mr-2 hidden md:block">
				<button
					className="flex h-9 min-w-[105px] items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 font-medium text-slate-600 text-xs transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
					onClick={() => {
						setHrdOpen((value) => !value);
						setStatusOpen(false);
						setNotificationOpen(false);
						setProfileOpen(false);
					}}
					type="button"
				>
					<div className="flex items-center gap-2">
						<Building2 className="size-3.5 text-slate-400" />
						<span>HRD</span>
					</div>

					<ChevronDown className="size-3.5 text-slate-400" />
				</button>

				{hrdOpen ? (
					<div className="absolute top-full right-0 z-[100] mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
						<button
							className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-slate-700 text-xs transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
							onClick={() => setHrdOpen(false)}
							type="button"
						>
							<Building2 className="size-4 text-[#0757ff] dark:text-blue-400" />
							HRD
						</button>

						<button
							className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-slate-500 text-xs transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
							onClick={() => setHrdOpen(false)}
							type="button"
						>
							<Building2 className="size-4" />
							Operations
						</button>
					</div>
				) : null}
			</div>

			{/* =========================================================
			    AGENT STATUS
			========================================================= */}
			<div className="relative mr-1">
				<button
					className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 text-slate-600 text-xs transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
					onClick={() => {
						setStatusOpen((value) => !value);
						setHrdOpen(false);
						setNotificationOpen(false);
						setProfileOpen(false);
					}}
					type="button"
				>
					<span className={`size-2.5 rounded-full ${statusColor}`} />

					<span className="hidden lg:inline">{status}</span>

					<ChevronDown className="size-3.5 text-slate-400" />
				</button>

				{statusOpen ? (
					<div className="absolute top-full right-0 z-[100] mt-2 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
						<StatusOption
							active={status === "Available"}
							label="Available"
							onClick={() => {
								setStatus("Available");
								setStatusOpen(false);
							}}
						/>

						<StatusOption
							active={status === "Away"}
							label="Away"
							onClick={() => {
								setStatus("Away");
								setStatusOpen(false);
							}}
						/>

						<StatusOption
							active={status === "Busy"}
							label="Busy"
							onClick={() => {
								setStatus("Busy");
								setStatusOpen(false);
							}}
						/>
					</div>
				) : null}
			</div>

			{/* =========================================================
			    THEME
			========================================================= */}
			<button
				aria-label="Toggle theme"
				className="flex size-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-blue-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
				onClick={toggleTheme}
				type="button"
			>
				{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
			</button>

			{/* =========================================================
			    NOTIFICATION
			========================================================= */}
			<div className="relative">
				<button
					aria-label="Notifications"
					className={`relative flex size-9 items-center justify-center rounded-md transition ${
						notificationOpen
							? "bg-blue-50 text-[#0757ff] dark:bg-blue-950/40 dark:text-blue-400"
							: "text-slate-500 hover:bg-blue-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
					}`}
					onClick={() => {
						setNotificationOpen((value) => !value);
						setStatusOpen(false);
						setProfileOpen(false);
						setHrdOpen(false);
					}}
					type="button"
				>
					<Bell className="size-4" />

					<span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
				</button>

				{/* =====================================================
				    NOTIFICATION DROPDOWN
				===================================================== */}
				{notificationOpen ? (
					<div className="absolute top-full right-0 z-[200] mt-2 w-[500px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
						{/* HEADER */}
						<div className="flex items-center justify-between border-slate-200 border-b px-5 py-3 dark:border-slate-700">
							<div>
								<h2 className="font-semibold text-slate-800 text-sm dark:text-slate-100">
									Notifications
								</h2>

								<p className="mt-0.5 text-[10px] text-slate-400">
									Recent activity
								</p>
							</div>

							<button
								aria-label="Mark all as read"
								className="flex size-8 items-center justify-center rounded-md text-[#0757ff] transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
								type="button"
							>
								<CheckCheck className="size-4" />
							</button>
						</div>

						{/* NOTIFICATION LIST */}
						<div className="max-h-[250px] overflow-y-auto">
							<NotificationItem
								description="You have successfully logged in."
								time="12:01 PM"
								title="Agent logged in"
							/>

							<NotificationItem
								description="Calling system is ready."
								time="12:02 PM"
								title="Dialer ready"
							/>

							<NotificationItem
								description="Lead data panel loaded."
								time="12:04 PM"
								title="Lead workspace opened"
							/>

							<NotificationItem
								description="Agent is currently available."
								time="12:05 PM"
								title="No active call"
							/>
						</div>

						{/* FOOTER */}
						<div className="border-slate-200 border-t dark:border-slate-700">
							<button
								className="flex h-10 w-full items-center justify-center gap-2 font-medium text-[#0757ff] text-xs transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
								type="button"
							>
								<Bell className="size-3.5" />
								Manage notifications
							</button>
						</div>
					</div>
				) : null}
			</div>

			{/* =========================================================
			    PROFILE
			========================================================= */}
			<div className="relative ml-2 flex items-center gap-2 border-slate-200 border-l pl-2 dark:border-slate-800">
				{/* TOPBAR PROFILE AVATAR */}
				<button
					aria-label="Agent profile"
					className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[#0757ff] shadow-sm transition hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/50"
					onClick={() => {
						setProfileOpen((value) => !value);
						setNotificationOpen(false);
						setStatusOpen(false);
						setHrdOpen(false);
					}}
					type="button"
				>
					<UserRound className="size-5" strokeWidth={1.8} />

					<span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
				</button>

				<div className="hidden min-w-0 lg:block">
					<p className="max-w-[100px] truncate font-medium text-slate-700 text-xs dark:text-slate-200">
						HRD Ashmita
					</p>

					<p className="truncate text-[9px] text-slate-400">Acefone</p>
				</div>

				<button
					aria-label="Agent menu"
					className="flex size-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
					onClick={() => {
						setProfileOpen((value) => !value);
						setNotificationOpen(false);
						setStatusOpen(false);
						setHrdOpen(false);
					}}
					type="button"
				>
					<ChevronDown className="size-3.5" />
				</button>

				{/* =====================================================
				    PROFILE DROPDOWN
				===================================================== */}
				{profileOpen ? (
					<div className="absolute top-full right-0 z-[200] mt-2 w-[360px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
						{/* PROFILE HEADER */}
						<div className="flex items-center gap-3 px-5 py-3">
							{/* PROFILE ICON */}
							<div className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/40">
								<UserRound
									className="size-6 text-[#0757ff] dark:text-blue-400"
									strokeWidth={1.8}
								/>

								{/* ONLINE INDICATOR */}
								<span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
							</div>

							{/* PROFILE INFO */}
							<div className="min-w-0 flex-1">
								<p className="truncate font-semibold text-base text-slate-800 dark:text-slate-100">
									HRD Ashmita
								</p>

								<p className="mt-0.5 text-slate-400 text-xs dark:text-slate-500">
									Acefone
								</p>

								<div className="mt-1 flex items-center gap-1.5">
									<span className="size-2 rounded-full bg-emerald-500" />

									<span className="font-medium text-[10px] text-emerald-600 dark:text-emerald-400">
										Online
									</span>
								</div>
							</div>
						</div>

						{/* SESSION STATUS */}
						<div className="border-slate-200 border-t border-b px-5 py-2.5 dark:border-slate-700">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="font-semibold text-slate-700 text-xs dark:text-slate-200">
										Session Status
									</p>

									<p className="mt-1 flex items-center gap-1.5 font-medium text-[11px] text-red-500">
										<span className="size-1.5 rounded-full bg-red-500" />
										Disconnected
									</p>
								</div>

								<button
									aria-label="Refresh session"
									className="flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-[#0757ff] transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-950/30"
									type="button"
								>
									<RefreshCw className="size-3.5" />
								</button>
							</div>
						</div>

						{/* INBOUND SETTINGS */}
						<button
							className="flex w-full items-center gap-3 border-slate-200 border-b px-5 py-2.5 text-left font-medium text-slate-600 text-xs transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
							type="button"
						>
							<Settings className="size-4 shrink-0 text-[#0757ff] dark:text-blue-400" />

							<span>Manage Inbound Settings</span>
						</button>

						{/* CALL STATISTICS */}
						<div className="border-slate-200 border-b px-5 py-3 dark:border-slate-700">
							<p className="mb-2 font-semibold text-[10px] text-slate-500 uppercase tracking-wide dark:text-slate-400">
								Call Statistics
							</p>

							<div className="space-y-1.5">
								<StatRow label="Total In Call Time" value="00:00:32" />

								<StatRow label="Total Break Duration" value="00:00:10" />

								<StatRow label="Total Available Duration" value="05:59:31" />

								<StatRow label="Total Logged Duration" value="06:07:24" />

								<StatRow label="Total Agent Idle Time" value="05:58:45" />
							</div>
						</div>

						{/* TODAY STATS */}
						<div className="border-slate-200 border-b px-5 py-3 dark:border-slate-700">
							<p className="mb-2 font-semibold text-[10px] text-slate-500 uppercase tracking-wide dark:text-slate-400">
								Today's Activity
							</p>

							<div className="space-y-1.5">
								<StatRow label="Calls Today" value="10" />

								<StatRow label="Outgoing Answered" value="1" />

								<StatRow label="Outgoing Dropped Calls" value="4" />

								<StatRow label="Incoming Answered" value="0" />

								<StatRow label="Incoming Missed" value="5" />
							</div>
						</div>

						{/* PROFILE ACTIONS */}
						<div className="p-1.5">
							<button
								className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-left text-slate-600 text-xs transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
								type="button"
							>
								<UserRound className="size-4" />
								My Profile
							</button>

							<button
								className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-left text-red-500 text-xs transition hover:bg-red-50 dark:hover:bg-red-950/20"
								type="button"
							>
								<LogOut className="size-4" />
								Logout
							</button>
						</div>
					</div>
				) : null}
			</div>
		</header>
	);
}

/* =========================================================
   STATUS OPTION
========================================================= */

function StatusOption({
	label,
	active,
	onClick,
}: {
	label: AgentStatus;
	active: boolean;
	onClick: () => void;
}) {
	const dotColor =
		label === "Available"
			? "bg-emerald-500"
			: label === "Busy"
				? "bg-red-500"
				: "bg-amber-500";

	return (
		<button
			className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition ${
				active
					? "bg-blue-50 text-[#0757ff] dark:bg-blue-950/30 dark:text-blue-400"
					: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
			}`}
			onClick={onClick}
			type="button"
		>
			<span className="flex items-center gap-2">
				<span className={`size-2 rounded-full ${dotColor}`} />
				{label}
			</span>

			{active ? <span className="font-medium text-[9px]">Active</span> : null}
		</button>
	);
}

/* =========================================================
   NOTIFICATION ITEM
========================================================= */

function NotificationItem({
	title,
	description,
	time,
}: {
	title: string;
	description: string;
	time: string;
}) {
	return (
		<div className="flex gap-3 border-slate-100 border-b px-5 py-3 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
			<div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
				<CheckCheck className="size-4 text-[#0757ff] dark:text-blue-400" />
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-4">
					<p className="font-medium text-slate-700 text-xs dark:text-slate-200">
						{title}
					</p>

					<span className="shrink-0 whitespace-nowrap text-[9px] text-slate-400">
						{time}
					</span>
				</div>

				<p className="mt-0.5 text-[10px] text-slate-400 leading-4 dark:text-slate-500">
					{description}
				</p>
			</div>
		</div>
	);
}

/* =========================================================
   STAT ROW
========================================================= */

function StatRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-4 text-[10px]">
			<span className="min-w-0 text-slate-500 dark:text-slate-400">
				{label}
			</span>

			<span className="shrink-0 font-medium text-slate-700 dark:text-slate-200">
				{value}
			</span>
		</div>
	);
}

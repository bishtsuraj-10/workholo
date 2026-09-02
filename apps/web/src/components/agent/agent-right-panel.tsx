// biome-ignore-all lint/performance/noJsxPropsBind: Agent right panel uses local UI state.

import {
	ArrowLeft,
	ArrowRight,
	CalendarDays,
	CheckCircle2,
	ChevronDown,
	Clock3,
	Copy,
	Edit3,
	History,
	Phone,
	PhoneIncoming,
	PhoneOutgoing,
	RefreshCw,
	Trash2,
	User,
} from "lucide-react";
import { useMemo, useState } from "react";

type PanelTab = "history" | "schedule" | "activity";
type CallType = "incoming" | "outgoing";

type CallHistory = {
	id: number;
	name: string;
	number: string;
	time: string;
	type: CallType;
};

type ScheduledCall = {
	id: number;
	name: string;
	number: string;
	scheduledAt: string;
	createdAt: string;
};

const callHistory: CallHistory[] = [
	{
		id: 1,
		name: "Sudeep Kumbar",
		number: "+919324516501",
		time: "03:10 PM",
		type: "incoming",
	},
	{
		id: 2,
		name: "Sudeep Kumbar",
		number: "+919324516501",
		time: "03:08 PM",
		type: "outgoing",
	},
	{
		id: 3,
		name: "neetika",
		number: "+918219818680",
		time: "03:07 PM",
		type: "incoming",
	},
	{
		id: 4,
		name: "Farhin",
		number: "+916202143293",
		time: "10:54 AM",
		type: "outgoing",
	},
	{
		id: 5,
		name: "Farhin",
		number: "+916202143293",
		time: "10:50 AM",
		type: "incoming",
	},
];

const initialScheduledCalls: ScheduledCall[] = [
	{
		createdAt: "Aug 31, 2026",
		id: 1,
		name: "deepak",
		number: "8826656949",
		scheduledAt: "03:26 PM",
	},
	{
		createdAt: "Aug 31, 2026",
		id: 2,
		name: "Rahul Sharma",
		number: "+919876543210",
		scheduledAt: "04:15 PM",
	},
	{
		createdAt: "Aug 31, 2026",
		id: 3,
		name: "Priya Singh",
		number: "+919812345678",
		scheduledAt: "05:00 PM",
	},
];

export function AgentRightPanel() {
	const [activeTab, setActiveTab] = useState<PanelTab>("history");
	const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>(
		initialScheduledCalls
	);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [refreshing, setRefreshing] = useState(false);

	const formattedDate = useMemo(() => {
		const isToday = isSameDay(selectedDate, new Date());

		if (isToday) {
			return "Today";
		}

		return selectedDate.toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
		});
	}, [selectedDate]);

	const handlePreviousDay = () => {
		setSelectedDate((current) => {
			const date = new Date(current);
			date.setDate(date.getDate() - 1);
			return date;
		});
	};

	const handleNextDay = () => {
		setSelectedDate((current) => {
			const date = new Date(current);
			date.setDate(date.getDate() + 1);
			return date;
		});
	};

	const handleToday = () => {
		setSelectedDate(new Date());
	};

	const handleRefresh = () => {
		setRefreshing(true);

		window.setTimeout(() => {
			setRefreshing(false);
		}, 700);
	};

	const handleDeleteSchedule = (id: number) => {
		setScheduledCalls((calls) => calls.filter((call) => call.id !== id));
	};

	const handleEditSchedule = (call: ScheduledCall) => {
		window.alert(`Edit scheduled call for ${call.name}`);
	};

	const handleCall = (call: ScheduledCall) => {
		window.alert(`Calling ${call.name} - ${call.number}`);
	};

	return (
		<aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
			{/* TOP TABS */}
			<div className="grid shrink-0 grid-cols-3 border-slate-200 border-b dark:border-slate-800">
				<PanelTab
					active={activeTab === "history"}
					icon={History}
					label="History"
					onClick={() => setActiveTab("history")}
				/>

				<PanelTab
					active={activeTab === "schedule"}
					icon={CalendarDays}
					label="Schedule"
					onClick={() => setActiveTab("schedule")}
				/>

				<PanelTab
					active={activeTab === "activity"}
					icon={Clock3}
					label="Activity"
					onClick={() => setActiveTab("activity")}
				/>
			</div>

			{/* DATE NAVIGATION */}
			<div className="flex shrink-0 items-center justify-between border-slate-200 border-b px-3 py-2.5 dark:border-slate-800">
				<button
					aria-label="Previous day"
					className="flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-blue-400"
					onClick={handlePreviousDay}
					type="button"
				>
					<ArrowLeft className="size-4" />
				</button>

				<button
					className="flex items-center gap-2 rounded-md px-3 py-1.5 font-medium text-slate-700 text-xs transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
					onClick={handleToday}
					type="button"
				>
					<CalendarDays className="size-3.5 text-slate-400" />
					<span>{formattedDate}</span>
					<ChevronDown className="size-3.5 text-slate-400" />
				</button>

				<button
					aria-label="Next day"
					className="flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-blue-400"
					onClick={handleNextDay}
					type="button"
				>
					<ArrowRight className="size-4" />
				</button>
			</div>

			{/* CONTENT */}
			<div className="min-h-0 flex-1 overflow-y-auto">
				{activeTab === "history" ? (
					<HistoryPanel onRefresh={handleRefresh} refreshing={refreshing} />
				) : null}

				{activeTab === "schedule" ? (
					<SchedulePanel
						calls={scheduledCalls}
						onCall={handleCall}
						onDelete={handleDeleteSchedule}
						onEdit={handleEditSchedule}
					/>
				) : null}

				{activeTab === "activity" ? <ActivityPanel /> : null}
			</div>
		</aside>
	);
}

/* -------------------------------------------------------------------------- */
/* TABS */
/* -------------------------------------------------------------------------- */

function PanelTab({
	active,
	icon: Icon,
	label,
	onClick,
}: {
	active: boolean;
	icon: typeof History;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			className={`flex h-12 items-center justify-center gap-1.5 border-b-2 text-[10px] transition-colors ${
				active
					? "border-[#0757ff] bg-blue-50/50 font-semibold text-[#0757ff] dark:border-blue-400 dark:bg-blue-950/20 dark:text-blue-400"
					: "border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-300"
			}`}
			onClick={onClick}
			type="button"
		>
			<Icon className="size-4" />
			{label}
		</button>
	);
}

/* -------------------------------------------------------------------------- */
/* HISTORY */
/* -------------------------------------------------------------------------- */

function HistoryPanel({
	refreshing,
	onRefresh,
}: {
	refreshing: boolean;
	onRefresh: () => void;
}) {
	return (
		<>
			{/* CURRENT CALL */}
			<div className="shrink-0 border-slate-200 border-b p-3 dark:border-slate-800">
				<div className="mb-2 flex items-center justify-between">
					<p className="font-semibold text-slate-700 text-xs dark:text-slate-200">
						Current Call
					</p>

					<button
						aria-label="Refresh calls"
						className="text-slate-400 transition hover:text-[#0757ff]"
						onClick={onRefresh}
						type="button"
					>
						<RefreshCw
							className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
						/>
					</button>
				</div>

				<div className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0757ff] dark:bg-blue-950/50 dark:text-blue-400">
						<User className="size-4" />
					</div>

					<div className="min-w-0 flex-1">
						<p className="truncate font-medium text-slate-700 text-xs dark:text-slate-200">
							Not Available
						</p>

						<p className="mt-0.5 truncate text-[10px] text-slate-400">
							Not Available
						</p>
					</div>

					<span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" />
				</div>
			</div>

			{/* HISTORY HEADER */}
			<div className="flex shrink-0 items-center justify-between border-slate-200 border-b px-3 py-2.5 dark:border-slate-800">
				<div className="flex items-center gap-2">
					<History className="size-3.5 text-[#0757ff] dark:text-blue-400" />

					<span className="font-semibold text-slate-700 text-xs dark:text-slate-200">
						Recent Calls
					</span>
				</div>

				<span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-[#0757ff] text-[9px] dark:bg-blue-950/40 dark:text-blue-400">
					{callHistory.length}
				</span>
			</div>

			{/* CALL LIST */}
			<div>
				{callHistory.map((call) => (
					<CallHistoryItem call={call} key={call.id} />
				))}
			</div>
		</>
	);
}

function CallHistoryItem({ call }: { call: CallHistory }) {
	const CallIcon = call.type === "incoming" ? PhoneIncoming : PhoneOutgoing;

	return (
		<div className="flex items-center gap-2.5 border-slate-100 border-b px-3 py-3 transition-colors hover:bg-blue-50/30 dark:border-slate-800 dark:hover:bg-blue-950/20">
			<div
				className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
					call.type === "incoming"
						? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
						: "bg-blue-50 text-[#0757ff] dark:bg-blue-950/30 dark:text-blue-400"
				}`}
			>
				<CallIcon className="size-3.5" />
			</div>

			<div className="min-w-0 flex-1">
				<p className="truncate font-medium text-slate-700 text-xs dark:text-slate-200">
					{call.name}
				</p>

				<div className="mt-0.5 flex items-center gap-1">
					<Phone className="size-2.5 text-slate-400" />

					<span className="truncate text-[10px] text-slate-400">
						{call.number}
					</span>
				</div>
			</div>

			<div className="shrink-0 text-right">
				<p className="text-[9px] text-slate-400">{call.time}</p>

				<p
					className={`mt-0.5 font-medium text-[8px] ${
						call.type === "incoming" ? "text-emerald-500" : "text-[#0757ff]"
					}`}
				>
					{call.type === "incoming" ? "Incoming" : "Outgoing"}
				</p>
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* SCHEDULE */
/* -------------------------------------------------------------------------- */

function SchedulePanel({
	calls,
	onCall,
	onEdit,
	onDelete,
}: {
	calls: ScheduledCall[];
	onCall: (call: ScheduledCall) => void;
	onEdit: (call: ScheduledCall) => void;
	onDelete: (id: number) => void;
}) {
	return (
		<>
			{/* HEADER */}
			<div className="flex items-center justify-between border-slate-200 border-b px-3 py-3 dark:border-slate-800">
				<div className="flex items-center gap-2">
					<CalendarDays className="size-4 text-[#0757ff] dark:text-blue-400" />

					<div>
						<p className="font-semibold text-slate-700 text-xs dark:text-slate-200">
							Scheduled Calls
						</p>

						<p className="mt-0.5 text-[9px] text-slate-400">
							Today's scheduled calls
						</p>
					</div>
				</div>

				<span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-[#0757ff] text-[9px] dark:bg-blue-950/40 dark:text-blue-400">
					{calls.length}
				</span>
			</div>

			{/* EMPTY STATE */}
			{calls.length === 0 ? (
				<div className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center">
					<div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
						<CalendarDays className="size-5 text-slate-400" />
					</div>

					<p className="font-medium text-slate-600 text-xs dark:text-slate-300">
						No scheduled calls
					</p>

					<p className="mt-1 text-[10px] text-slate-400">
						There are no calls scheduled for this day.
					</p>
				</div>
			) : null}

			{/* SCHEDULED CALLS */}
			<div>
				{calls.map((call) => (
					<ScheduleItem
						call={call}
						key={call.id}
						onCall={onCall}
						onDelete={onDelete}
						onEdit={onEdit}
					/>
				))}
			</div>
		</>
	);
}

function ScheduleItem({
	call,
	onCall,
	onEdit,
	onDelete,
}: {
	call: ScheduledCall;
	onCall: (call: ScheduledCall) => void;
	onEdit: (call: ScheduledCall) => void;
	onDelete: (id: number) => void;
}) {
	return (
		<div className="group border-slate-100 border-b px-3 py-3.5 transition-colors hover:bg-blue-50/30 dark:border-slate-800 dark:hover:bg-blue-950/20">
			<div className="flex items-start gap-2.5">
				{/* USER ICON */}
				<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0757ff] dark:bg-blue-950/40 dark:text-blue-400">
					<User className="size-4" />
				</div>

				{/* DETAILS */}
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<p className="truncate font-semibold text-slate-700 text-xs dark:text-slate-200">
								{call.name}
							</p>

							<div className="mt-1 flex items-center gap-1">
								<Phone className="size-2.5 text-slate-400" />

								<span className="truncate text-[10px] text-slate-500 dark:text-slate-400">
									{call.number}
								</span>
							</div>
						</div>

						{/* TIME */}
						<div className="flex shrink-0 items-center gap-1 rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-950/40">
							<Clock3 className="size-3 text-[#0757ff] dark:text-blue-400" />

							<span className="font-semibold text-[#0757ff] text-[9px] dark:text-blue-400">
								{call.scheduledAt}
							</span>
						</div>
					</div>

					{/* CREATED */}
					<div className="mt-2 flex items-center gap-1 text-[9px] text-slate-400">
						<span>Created At:</span>

						<span>{call.createdAt}</span>
					</div>

					{/* ACTIONS */}
					<div className="mt-3 flex items-center gap-1.5">
						<button
							className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#0757ff] px-2 font-medium text-[9px] text-white transition hover:bg-[#004be0]"
							onClick={() => onCall(call)}
							type="button"
						>
							<Phone className="size-3" />
							Call
						</button>

						<button
							aria-label={`Edit ${call.name}`}
							className="flex size-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
							onClick={() => onEdit(call)}
							type="button"
						>
							<Edit3 className="size-3" />
						</button>

						<button
							aria-label={`Copy ${call.number}`}
							className="flex size-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
							onClick={() => {
								void navigator.clipboard?.writeText(call.number);
							}}
							type="button"
						>
							<Copy className="size-3" />
						</button>

						<button
							aria-label={`Delete ${call.name}`}
							className="flex size-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:hover:bg-red-950/20"
							onClick={() => onDelete(call.id)}
							type="button"
						>
							<Trash2 className="size-3" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* ACTIVITY */
/* -------------------------------------------------------------------------- */

function ActivityPanel() {
	const activities = [
		{
			description: "Agent session started",
			time: "12:01 PM",
			title: "Agent logged in",
		},
		{
			description: "Calling system is ready",
			time: "12:02 PM",
			title: "Dialer ready",
		},
		{
			description: "Lead data panel loaded",
			time: "12:04 PM",
			title: "Lead workspace opened",
		},
		{
			description: "Agent is currently available",
			time: "12:05 PM",
			title: "No active call",
		},
	];

	return (
		<>
			<div className="flex items-center justify-between border-slate-200 border-b px-3 py-3 dark:border-slate-800">
				<div className="flex items-center gap-2">
					<Clock3 className="size-4 text-[#0757ff] dark:text-blue-400" />

					<div>
						<p className="font-semibold text-slate-700 text-xs dark:text-slate-200">
							Activity
						</p>

						<p className="mt-0.5 text-[9px] text-slate-400">
							Recent agent activity
						</p>
					</div>
				</div>
			</div>

			<div className="p-3">
				{activities.map((activity, index) => (
					<div
						className="relative flex gap-3 pb-5 last:pb-0"
						key={`${activity.title}-${activity.time}`}
					>
						{index === activities.length - 1 ? null : (
							<div className="absolute top-7 left-[9px] h-full w-px bg-slate-200 dark:bg-slate-800" />
						)}

						<div className="relative flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
							<CheckCircle2 className="size-3 text-[#0757ff] dark:text-blue-400" />
						</div>

						<div className="min-w-0 flex-1">
							<div className="flex items-start justify-between gap-2">
								<p className="font-medium text-slate-700 text-xs dark:text-slate-200">
									{activity.title}
								</p>

								<span className="shrink-0 text-[8px] text-slate-400">
									{activity.time}
								</span>
							</div>

							<p className="mt-0.5 text-[10px] text-slate-400">
								{activity.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

/* -------------------------------------------------------------------------- */
/* HELPERS */
/* -------------------------------------------------------------------------- */

function isSameDay(first: Date, second: Date) {
	return (
		first.getFullYear() === second.getFullYear() &&
		first.getMonth() === second.getMonth() &&
		first.getDate() === second.getDate()
	);
}

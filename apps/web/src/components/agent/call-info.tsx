// biome-ignore-all lint/performance/noJsxPropsBind: Call info uses local UI controls.

import { Clock3, Phone, RefreshCw, UserRound } from "lucide-react";
import { useState } from "react";

export function CallInfo() {
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = () => {
		setRefreshing(true);

		window.setTimeout(() => {
			setRefreshing(false);
		}, 700);
	};

	return (
		<section className="shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
			<div className="flex min-h-[116px] items-center justify-between gap-6 px-4 py-3.5 md:px-5">
				{/* CALLER INFO */}
				<div className="flex min-w-0 items-center gap-5">
					{/* USER AVATAR */}
					<div className="relative shrink-0">
						<div className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-[#0757ff] ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-900/50">
							<UserRound className="size-7" strokeWidth={1.8} />
						</div>

						<span className="absolute right-0.5 bottom-0.5 flex size-3 items-center justify-center rounded-full border-2 border-white bg-slate-300 dark:border-slate-950 dark:bg-slate-600">
							<span className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
						</span>
					</div>

					{/* DETAILS */}
					<div className="min-w-0 pl-1">
						<div className="flex items-center gap-2">
							<p className="truncate font-semibold text-slate-900 text-sm md:text-base dark:text-white">
								Not Available
							</p>

							<button
								aria-label="Refresh caller information"
								className="flex size-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-blue-50 hover:text-[#0757ff] dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
								type="button"
							>
								<RefreshCw className="size-3.5" />
							</button>
						</div>

						<div className="mt-1.5 space-y-1">
							<div className="flex items-center gap-1.5 text-slate-500 text-xs dark:text-slate-400">
								<UserRound className="size-3 shrink-0" />
								<span>Not Available</span>
							</div>

							<div className="flex items-center gap-1.5 text-slate-500 text-xs dark:text-slate-400">
								<Phone className="size-3 shrink-0" />
								<span>Not Available</span>
							</div>
						</div>
					</div>
				</div>

				{/* TIMERS */}
				<div className="grid shrink-0 grid-cols-3 gap-2 md:gap-3">
					<Timer icon={Clock3} label="CALL DURATION" value="00:00" />

					<Timer icon={Clock3} label="CALL HOLD" value="00:00" />

					<Timer icon={Clock3} label="TOTAL HOLD" value="00:00" />
				</div>
			</div>
		</section>
	);
}

function Timer({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof Clock3;
	label: string;
	value: string;
}) {
	return (
		<div className="flex min-w-[110px] flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
			<div className="mb-1 flex items-center gap-1.5">
				<Icon className="size-3 text-[#0757ff] dark:text-blue-400" />

				<p className="font-medium text-[#0757ff] text-[9px] uppercase tracking-wide dark:text-blue-400">
					{label}
				</p>
			</div>

			<p className="font-semibold text-base text-slate-900 tabular-nums dark:text-white">
				{value}
			</p>
		</div>
	);
}

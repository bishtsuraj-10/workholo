// biome-ignore-all lint/performance/noJsxPropsBind: The action uses the route-local navigator.
import { PhoneCall } from "lucide-react";

export function AgentLeftPanel() {
	return (
		<aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
			{/* Dial button */}
			<div className="border-slate-200 border-b p-2 dark:border-slate-800">
				<button
					className="h-11 w-full rounded-md border border-[#0757ff] bg-white font-medium text-[#0757ff] text-sm transition-colors hover:bg-blue-50 dark:bg-slate-950 dark:text-blue-400 dark:hover:bg-blue-950/30"
					type="button"
				>
					<div className="flex items-center justify-center gap-2">
						<PhoneCall className="size-4" />
						<span>Dial next</span>
					</div>
				</button>
			</div>

			{/* Empty lead area */}
			<div className="min-h-0 flex-1" />

			{/* Undisposed leads */}
			<div className="border-slate-200 border-t dark:border-slate-800">
				<div className="flex h-14 items-center justify-center bg-blue-50 font-semibold text-[#0757ff] text-sm dark:bg-blue-950/30 dark:text-blue-400">
					Undisposed Leads
				</div>

				<div className="flex h-16 items-center justify-center px-3 text-center text-slate-600 text-sm dark:text-slate-400">
					No Undisposed Leads found
				</div>
			</div>
		</aside>
	);
}

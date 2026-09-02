import {
	ArrowRightLeft,
	Headphones,
	MicOff,
	PhoneCall,
	PhoneOff,
	Users,
} from "lucide-react";

type CallControl = {
	label: string;
	icon: typeof MicOff;
};

const controls: CallControl[] = [
	{
		icon: MicOff,
		label: "Mute",
	},
	{
		icon: Headphones,
		label: "Hold",
	},
	{
		icon: PhoneCall,
		label: "Blind transfer",
	},
	{
		icon: ArrowRightLeft,
		label: "Consult transfer",
	},
	{
		icon: Users,
		label: "Conference",
	},
	{
		icon: PhoneOff,
		label: "Hang up",
	},
];

export function CallControls() {
	return (
		<div className="flex w-full shrink-0 gap-2 md:gap-2.5">
			{controls.map(({ label, icon: Icon }) => {
				const isHangUp = label === "Hang up";

				return (
					<button
						className={`group relative flex h-[76px] min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg border px-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0757ff]/20 ${
							isHangUp
								? "border-red-100 bg-red-50/70 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-950/40"
								: "border-slate-200 bg-white text-slate-500 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/60 hover:text-[#0757ff] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
						}`}
						key={label}
						type="button"
					>
						{/* ICON */}
						<div
							className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
								isHangUp
									? "bg-red-500 text-white group-hover:bg-red-600 dark:bg-red-600 dark:group-hover:bg-red-700"
									: "bg-slate-50 text-slate-600 group-hover:bg-blue-100 group-hover:text-[#0757ff] dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400"
							}`}
						>
							<Icon className="size-8 pt-2" strokeWidth={1.9} />
						</div>

						{/* LABEL */}
						<span
							className={`truncate p-3 pb-1 text-center font-medium text-[25px] leading-4 ${
								isHangUp
									? "text-red-500 dark:text-red-400"
									: "text-slate-600 dark:text-slate-300"
							}`}
						>
							{label}
						</span>
					</button>
				);
			})}
		</div>
	);
}

// biome-ignore-all lint/performance/noJsxPropsBind: Lead workspace uses local UI state.

import {
	AtSign,
	Building2,
	Copy,
	Flag,
	MapPin,
	Phone,
	User,
} from "lucide-react";
import { useState } from "react";

type Tab = "lead" | "manual";

const leadFields = [
	{
		icon: Phone,
		label: "Phone Number",
		placeholder: "Enter Phone Number",
	},
	{
		icon: User,
		label: "Name",
		placeholder: "Enter Name",
	},
	{
		icon: AtSign,
		label: "Email Id",
		placeholder: "Enter Email Id",
	},
	{
		icon: MapPin,
		label: "Address",
		placeholder: "Enter Address",
	},
	{
		icon: Building2,
		label: "Company Name",
		placeholder: "Enter Company Name",
	},
	{
		icon: Phone,
		label: "Alternate Phone Number",
		placeholder: "Enter Alternate Phone Number",
	},
	{
		icon: Copy,
		label: "Work Experience",
		placeholder: "Enter Work Experience",
	},
	{
		icon: Copy,
		label: "Current Employer",
		placeholder: "Enter Current Employer",
	},
	{
		icon: Copy,
		label: "Current Salary",
		placeholder: "Enter Current Salary",
	},
	{
		icon: MapPin,
		label: "Current Location",
		placeholder: "Enter Current Location",
	},
	{
		icon: Copy,
		label: "Designation",
		placeholder: "Enter Designation",
	},
	{
		icon: Flag,
		label: "Lead Priority",
		placeholder: "Priority Value",
	},
	{
		icon: Copy,
		label: "External Reference Id",
		placeholder: "External Reference Id",
	},
];

export function LeadWorkspace() {
	const [activeTab, setActiveTab] = useState<Tab>("lead");

	const [searchType, setSearchType] = useState<"phone" | "name">("phone");
	const [phoneNumber, setPhoneNumber] = useState("");

	return (
		<section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
			{/* TABS */}
			<div className="grid shrink-0 grid-cols-2 border-slate-200 border-b dark:border-slate-800">
				<TabButton
					active={activeTab === "lead"}
					label="LEAD DATA"
					onClick={() => setActiveTab("lead")}
				/>

				<TabButton
					active={activeTab === "manual"}
					label="MANUAL DIAL"
					onClick={() => setActiveTab("manual")}
				/>
			</div>

			{/* SCROLL AREA */}
			<div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
				{activeTab === "lead" ? (
					<LeadData />
				) : (
					<ManualDial
						phoneNumber={phoneNumber}
						searchType={searchType}
						setPhoneNumber={setPhoneNumber}
						setSearchType={setSearchType}
					/>
				)}
			</div>
		</section>
	);
}

function TabButton({
	active,
	label,
	onClick,
}: {
	active: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			className={`h-14 border-b-2 px-4 font-medium text-sm transition-colors ${
				active
					? "border-[#0757ff] text-[#0757ff] dark:border-blue-400 dark:text-blue-400"
					: "border-transparent text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
			}`}
			onClick={onClick}
			type="button"
		>
			{label}
		</button>
	);
}

function LeadData() {
	return (
		<div className="w-full px-4 py-3 md:px-5">
			{/* LEAD FIELDS */}
			<div className="grid w-full grid-cols-2 gap-x-5 gap-y-3">
				{leadFields.map((field) => (
					<LeadField
						icon={field.icon}
						key={field.label}
						label={field.label}
						placeholder={field.placeholder}
					/>
				))}

				{/* DISPOSITION STATUS */}
				<div className="min-w-0">
					<FieldLabel label="Disposition Status" />

					<select className="h-10 w-full rounded-md border border-slate-200 bg-slate-100 px-3 text-slate-600 text-sm outline-none transition focus:border-[#0757ff] focus:ring-1 focus:ring-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
						<option>Select Disposition Status</option>
						<option>Interested</option>
						<option>Not Interested</option>
						<option>Callback</option>
						<option>Not Reachable</option>
					</select>
				</div>
			</div>

			{/* COMMENTS - FULL WIDTH */}
			<div className="mt-3 w-full">
				<FieldLabel label="Comments (If Any)" />

				<textarea
					className="h-20 w-full resize-none rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0757ff] focus:ring-1 focus:ring-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
					placeholder="Please enter any notes regarding the call or lead here. It will be auto filled as the disposition note."
				/>
			</div>
		</div>
	);
}

function LeadField({
	label,
	placeholder,
	icon: Icon,
}: {
	label: string;
	placeholder: string;
	icon: typeof Phone;
}) {
	return (
		<div className="min-w-0">
			<FieldLabel label={label} />

			<div className="flex h-10 w-full items-center rounded-md border border-slate-200 bg-slate-100 px-3 transition focus-within:border-[#0757ff] focus-within:ring-1 focus-within:ring-[#0757ff] dark:border-slate-700 dark:bg-slate-900">
				<Icon className="mr-2 size-4 shrink-0 text-slate-500 dark:text-slate-400" />

				<input
					className="min-w-0 flex-1 bg-transparent text-slate-700 text-sm outline-none placeholder:text-slate-400 dark:text-slate-200"
					placeholder={placeholder}
				/>

				<button
					aria-label={`Copy ${label}`}
					className="ml-2 flex size-6 shrink-0 items-center justify-center rounded text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
					type="button"
				>
					<Copy className="size-3.5" />
				</button>
			</div>
		</div>
	);
}

function FieldLabel({ label }: { label: string }) {
	return (
		<label className="mb-1 block font-medium text-[#0757ff] text-xs dark:text-blue-400">
			{label}
		</label>
	);
}

function ManualDial({
	searchType,
	phoneNumber,
	setSearchType,
	setPhoneNumber,
}: {
	searchType: "phone" | "name";
	phoneNumber: string;
	setSearchType: (value: "phone" | "name") => void;
	setPhoneNumber: (value: string) => void;
}) {
	return (
		<div className="min-h-full bg-white dark:bg-slate-950">
			{/* MANUAL DIAL HEADER */}
			<div className="grid shrink-0 grid-cols-1 border-slate-200 border-b lg:grid-cols-2 dark:border-slate-800">
				{/* SEARCH TYPE */}
				<div className="flex items-center justify-center gap-7 px-5 py-3">
					<label className="flex cursor-pointer items-center gap-2 text-slate-700 text-sm dark:text-slate-300">
						<input
							checked={searchType === "phone"}
							className="size-4 accent-[#0757ff]"
							name="manual-search"
							onChange={() => setSearchType("phone")}
							type="radio"
						/>

						<span>Phone Number</span>
					</label>

					<label className="flex cursor-pointer items-center gap-2 text-slate-700 text-sm dark:text-slate-300">
						<input
							checked={searchType === "name"}
							className="size-4 accent-[#0757ff]"
							name="manual-search"
							onChange={() => setSearchType("name")}
							type="radio"
						/>

						<span>Name</span>
					</label>
				</div>

				{/* FILTERED LEADS TITLE */}
				<div className="flex items-center justify-center border-slate-200 border-t px-5 py-3 lg:border-t-0 lg:border-l dark:border-slate-800">
					<span className="font-semibold text-slate-500 text-sm dark:text-slate-400">
						Filtered Leads
					</span>
				</div>
			</div>

			{/* CONTENT */}
			<div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
				{/* DIAL SECTION */}
				<div className="rounded-md border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
					<div className="mb-4">
						<h3 className="font-semibold text-slate-800 text-sm dark:text-slate-100">
							Manual Dial
						</h3>

						<p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
							Enter the details below to place a call.
						</p>
					</div>

					{/* INPUT */}
					<label className="mb-1.5 block font-medium text-[#0757ff] text-xs dark:text-blue-400">
						{searchType === "phone" ? "Phone Number" : "Name"}
					</label>

					<div className="flex h-11 overflow-hidden rounded-md border border-slate-200 bg-white transition-colors focus-within:border-[#0757ff] focus-within:ring-1 focus-within:ring-[#0757ff] dark:border-slate-700 dark:bg-slate-950">
						<div className="flex w-10 shrink-0 items-center justify-center text-slate-400 dark:text-slate-500">
							{searchType === "phone" ? (
								<Phone className="size-4" />
							) : (
								<User className="size-4" />
							)}
						</div>

						<input
							className="min-w-0 flex-1 bg-transparent px-1 text-slate-700 text-sm outline-none placeholder:text-slate-400 dark:text-slate-200"
							onChange={(event) => setPhoneNumber(event.target.value)}
							placeholder={
								searchType === "phone" ? "Enter Phone Number" : "Enter Name"
							}
							value={phoneNumber}
						/>

						<button
							className="flex w-11 shrink-0 items-center justify-center bg-[#0757ff] text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={!phoneNumber.trim()}
							type="button"
						>
							<Phone className="size-4" />
						</button>
					</div>

					{/* CALL BUTTON */}
					<div className="mt-5">
						<button
							className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0757ff] font-medium text-sm text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={!phoneNumber.trim()}
							type="button"
						>
							<Phone className="size-4" />
							Call Now
						</button>
					</div>
				</div>

				{/* FILTERED LEADS */}
				<div className="flex min-h-[190px] flex-col items-center justify-center rounded-md border border-slate-300 border-dashed bg-slate-50/60 px-5 dark:border-slate-700 dark:bg-slate-900/30">
					<div className="mb-3 flex size-10 items-center justify-center rounded-full bg-blue-50 text-[#0757ff] dark:bg-blue-950/40 dark:text-blue-400">
						<Phone className="size-5" />
					</div>

					<p className="font-medium text-slate-600 text-sm dark:text-slate-300">
						No filtered leads found
					</p>

					<p className="mt-1 text-center text-slate-400 text-xs dark:text-slate-500">
						Search using a phone number or name to find matching leads.
					</p>
				</div>
			</div>
		</div>
	);
}

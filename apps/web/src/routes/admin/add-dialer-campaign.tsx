// biome-ignore-all lint/performance/noJsxPropsBind: Wizard controls intentionally use component state.

import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import { ChevronRight, PhoneCall } from "lucide-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { queryClient, queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/admin/add-dialer-campaign")({
	validateSearch: (search: Record<string, unknown>) => ({
		edit: typeof search.edit === "string" ? search.edit : undefined,
	}),
	component: AddDialerCampaignPage,
});

type Fields = {
	accountTimezone: string;
	addTransferList: string;
	afterCallDisposition: string;
	afterCallWorkDuration: number;
	agent: string;
	agentConnectionMethod: string;
	agentDialInNumber: string;
	agentOnlyCallback: boolean;
	agentVoiceGreeting: string;
	callerIdType: string;
	callsBeforeRingDuration: number;
	campaignCallerId: string;
	campaignScript: string;
	description: string;
	dialMethod: string;
	dialStatus: string;
	dispositionList: string;
	enableInbound: boolean;
	enableManualDial: boolean;
	enforceAgentPauseCode: boolean;
	holidayCalendar: string;
	leadListId: string | null;
	manualDialLimit: number;
	name: string;
	previewDuration: number;
	refreshCount: number;
	refreshInterval: string;
	ringTimeout: number;
	timeGroup: string;
	webform: string;
	wrapUpTime: number;
};
const emptyCampaign = (): Fields => ({
	accountTimezone: "Asia/Kolkata",
	addTransferList: "Select an option",
	afterCallDisposition: "Select an option",
	afterCallWorkDuration: 0,
	agent: "Select options",
	agentConnectionMethod: "Dial In (Session)",
	agentDialInNumber: "",
	agentOnlyCallback: false,
	agentVoiceGreeting: "Select an option",
	callerIdType: "Select an option",
	callsBeforeRingDuration: 30,
	campaignCallerId: "Select options",
	campaignScript: "Select an option",
	description: "",
	dialMethod: "Preview",
	dialStatus: "New",
	dispositionList: "CRLAB",
	enableInbound: false,
	enableManualDial: false,
	enforceAgentPauseCode: false,
	holidayCalendar: "Select an option",
	leadListId: null,
	manualDialLimit: 0,
	name: "",
	previewDuration: 10,
	refreshCount: 1,
	refreshInterval: "00:00:30",
	ringTimeout: 30,
	timeGroup: "Select Time Group",
	webform: "Select Webform",
	wrapUpTime: 30,
});
type FieldKey = keyof Fields;
type Field = {
	key: FieldKey;
	label: string;
	options?: string[];
	type?: "number" | "toggle";
};
const basicFields: Field[] = [
	{ key: "name", label: "Name*" },
	{
		key: "dialMethod",
		label: "Dial Method*",
		options: ["Preview", "Progressive", "Predictive"],
	},
	{
		key: "dispositionList",
		label: "Disposition List*",
		options: ["CRLAB", "CRM", "CRLA", "CRLB"],
	},
	{ key: "wrapUpTime", label: "Wrap Up Time (In Seconds)*", type: "number" },
	{ key: "refreshCount", label: "Refresh Count", type: "number" },
	{
		key: "afterCallWorkDuration",
		label: "After Call Work Duration (In Seconds)*",
		type: "number",
	},
	{ key: "description", label: "Description" },
	{
		key: "previewDuration",
		label: "Preview Duration (In Seconds)*",
		type: "number",
	},
	{
		key: "campaignCallerId",
		label: "Campaign Caller ID*",
		options: ["Select options", "+918064370287", "+917965369371"],
	},
	{ key: "leadListId", label: "Lead List" },
	{
		key: "dialStatus",
		label: "Dial Status*",
		options: ["New", "Pending", "Completed"],
	},
	{ key: "refreshInterval", label: "Refresh Interval (DD:HH:MM)" },
];
const agentFields: Field[] = [
	{
		key: "agentConnectionMethod",
		label: "Agent Connection Method*",
		options: ["Dial In (Session)", "Browser", "Auto Connect"],
	},
	{
		key: "enforceAgentPauseCode",
		type: "toggle",
		label: "Enforce Agent Pause Code",
	},
	{ key: "agentDialInNumber", label: "Agent Dial-In Number*" },
	{
		key: "agent",
		label: "Agent*",
		options: ["Select options", "Meera", "CRLA Zainab", "CRLA Tasneem"],
	},
	{ key: "ringTimeout", label: "Ring Timeout (In Seconds)*", type: "number" },
	{ key: "agentOnlyCallback", label: "Agent Only Callback", type: "toggle" },
];
const advancedFields: Field[] = [
	{
		key: "agentVoiceGreeting",
		label: "Agent Voice Greeting",
		options: ["Select an option", "Default", "Custom Greeting"],
	},
	{
		key: "callerIdType",
		label: "Caller ID Type",
		options: ["Select an option", "Random", "Fixed"],
	},
	{
		key: "campaignScript",
		label: "Campaign Script",
		options: ["Select an option", "Default"],
	},
	{
		key: "timeGroup",
		label: "Time Group",
		options: ["Select Time Group", "Business Hours", "24x7"],
	},
	{
		key: "accountTimezone",
		label: "Account Timezone",
		options: ["Asia/Kolkata", "UTC", "Asia/Dubai"],
	},
	{
		key: "addTransferList",
		label: "Add Transfer List",
		options: ["Select an option", "Default List"],
	},
	{
		key: "afterCallDisposition",
		label: "After Call Disposition",
		options: ["Select an option", "Automatic"],
	},
	{
		key: "holidayCalendar",
		label: "Holiday Calendar",
		options: ["Select an option", "Default Calendar"],
	},
	{
		key: "enableManualDial",
		type: "toggle",
		label: "Enable Manual Dial",
	},
	{ key: "manualDialLimit", label: "Manual Dial Limit", type: "number" },
	{ key: "enableInbound", label: "Enable Inbound", type: "toggle" },
	{ key: "webform", label: "Webform" },
	{
		key: "callsBeforeRingDuration",
		label: "Calls before Ring Duration (In Seconds)",
		type: "number",
	},
];
const stepDetails = [
	{
		title: "Basic Settings",
		description: "Configure the basic campaign information.",
		fields: basicFields,
	},
	{
		title: "Agent Settings",
		description: "Configure how agents connect to the campaign.",
		fields: agentFields,
	},
	{
		title: "Advanced Settings (Optional)",
		description: "Optional campaign configuration.",
		fields: advancedFields,
	},
] as const;

function AddDialerCampaignPage() {
	const { edit } = Route.useSearch();
	const {
		data: campaign,
		error,
		isLoading,
	} = useQuery(
		queryUtils.dialerCampaigns.getById.queryOptions({
			input: { id: edit ?? "" },
			enabled: Boolean(edit),
		})
	);
	if (isLoading) {
		return <div className="p-6">Loading campaign...</div>;
	}
	if (error) {
		return <div className="p-6 text-red-500">Unable to load campaign.</div>;
	}
	return (
		<DialerCampaignForm
			campaign={campaign ?? undefined}
			key={campaign?.id ?? "new"}
			mode={edit ? "edit" : "create"}
		/>
	);
}
function DialerCampaignForm({
	campaign,
	mode,
}: {
	campaign?: Fields & { id: string };
	mode: "create" | "edit";
}) {
	const navigate = useNavigate();
	const [step, setStep] = useState(0);
	const [form, setForm] = useState<Fields>(() => {
		if (!campaign) {
			return emptyCampaign();
		}
		const { id: _id, ...fields } = campaign;
		return fields;
	});
	const update = <Key extends FieldKey>(key: Key, value: Fields[Key]) =>
		setForm((current) => ({ ...current, [key]: value }));
	const { data: leadLists = [] } = useQuery(
		queryUtils.leadLists.getAll.queryOptions()
	);
	const createMutation = useMutation(
		queryUtils.dialerCampaigns.create.mutationOptions()
	);
	const updateMutation = useMutation(
		queryUtils.dialerCampaigns.update.mutationOptions()
	);
	const isSaving = createMutation.isPending || updateMutation.isPending;
	const save = async () => {
		if (!form.name.trim()) {
			return;
		}
		try {
			if (campaign) {
				await updateMutation.mutateAsync({ ...form, id: campaign.id });
			} else {
				await createMutation.mutateAsync(form);
			}
			await queryClient.invalidateQueries({
				queryKey: queryUtils.dialerCampaigns.getAll.queryKey(),
			});
			navigate({ to: "/admin/dialer-campaigns" });
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to save dialer campaign."
			);
		}
	};
	const details = stepDetails[step];
	const title =
		mode === "edit" ? "Change Dialer Campaign" : "Add Dialer Campaign";
	return (
		<div className="flex min-h-svh flex-col bg-[#eef3f9] dark:bg-slate-950">
			<AdminTopbar />
			<main className="flex-1 p-4 md:p-6">
				<div className="mx-auto max-w-[1500px]">
					<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<header className="flex items-center gap-3 border-slate-100 border-b px-5 py-4 dark:border-slate-800">
							<div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757ff]">
								<PhoneCall className="size-4" />
							</div>
							<div>
								<h1 className="font-bold text-[#102b55] text-lg dark:text-white">
									{title}
								</h1>
								<p className="mt-0.5 text-slate-400 text-xs">
									Create and configure a dialer campaign.
								</p>
							</div>
						</header>
						<div className="p-5 md:p-6">
							<div className="mb-5 grid gap-2 md:grid-cols-3">
								{stepDetails.map((item, index) => (
									<button
										className={`flex h-11 items-center gap-2 rounded-lg px-4 text-left font-semibold text-xs ${index === step ? "bg-[#0757ff] text-white" : "border border-slate-200 bg-slate-50 text-slate-500"}`}
										key={item.title}
										onClick={() => setStep(index)}
										type="button"
									>
										<span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-[10px]">
											{index + 1}
										</span>
										{item.title}
										{index === step ? (
											<ChevronRight className="ml-auto size-3.5" />
										) : null}
									</button>
								))}
							</div>
							<CampaignSection
								description={details.description}
								title={details.title}
							>
								<div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
									{details.fields.map((field) => (
										<CampaignField
											field={field}
											form={form}
											key={field.key}
											leadLists={leadLists.filter(
												(leadList): leadList is NonNullable<typeof leadList> =>
													leadList !== null
											)}
											update={update}
										/>
									))}
								</div>
							</CampaignSection>
							<div className="mt-5 flex justify-end gap-2">
								<Button
									onClick={() => navigate({ to: "/admin/dialer-campaigns" })}
									type="button"
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									disabled={step === 0}
									onClick={() => setStep((current) => current - 1)}
									type="button"
									variant="outline"
								>
									Previous
								</Button>
								{step < 2 ? (
									<Button
										onClick={() => setStep((current) => current + 1)}
										type="button"
									>
										Next
										<ChevronRight className="size-3.5" />
									</Button>
								) : (
									<Button
										disabled={!form.name.trim() || isSaving}
										onClick={save}
										type="button"
									>
										{mode === "edit" ? "Save Changes" : "Save Campaign"}
									</Button>
								)}
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
function CampaignSection({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
			<header className="border-slate-100 border-b bg-slate-50/70 px-5 py-3 dark:border-slate-800">
				<h2 className="font-semibold text-[#102b55] text-sm dark:text-white">
					{title}
				</h2>
				<p className="mt-1 text-[10px] text-slate-400">{description}</p>
			</header>
			<div className="p-5">{children}</div>
		</section>
	);
}
function CampaignField({
	field,
	form,
	leadLists,
	update,
}: {
	field: Field;
	form: Fields;
	leadLists: { id: string; name: string }[];
	update: <Key extends FieldKey>(key: Key, value: Fields[Key]) => void;
}) {
	const id = `campaign-${field.key}`;
	const value = form[field.key];
	if (field.key === "leadListId") {
		return (
			<div className="flex flex-col gap-2">
				<label className="font-medium text-slate-500 text-xs" htmlFor={id}>
					{field.label}
				</label>
				<select
					className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"
					id={id}
					onChange={(event) => update(field.key, event.target.value || null)}
					value={String(value ?? "")}
				>
					<option value="">Select lead list</option>
					{leadLists.map((leadList) => (
						<option key={leadList.id} value={leadList.id}>
							{leadList.name}
						</option>
					))}
				</select>
			</div>
		);
	}
	if (field.type === "toggle") {
		return (
			<label className="flex min-h-12 items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4">
				<span className="font-medium text-slate-600 text-xs">
					{field.label}
				</span>
				<input
					checked={Boolean(value)}
					className="size-4 accent-[#0757ff]"
					onChange={(event) =>
						update(field.key, event.target.checked as Fields[typeof field.key])
					}
					type="checkbox"
				/>
			</label>
		);
	}
	return (
		<div className="flex flex-col gap-2">
			<label className="font-medium text-slate-500 text-xs" htmlFor={id}>
				{field.label}
			</label>
			{field.options ? (
				<select
					className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"
					id={id}
					onChange={(event) =>
						update(field.key, event.target.value as Fields[typeof field.key])
					}
					value={String(value)}
				>
					{field.options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			) : (
				<Input
					id={id}
					onChange={(event) =>
						update(
							field.key,
							(field.type === "number"
								? Number(event.target.value) || 0
								: event.target.value) as Fields[typeof field.key]
						)
					}
					type={field.type === "number" ? "number" : "text"}
					value={String(value)}
				/>
			)}
		</div>
	);
}

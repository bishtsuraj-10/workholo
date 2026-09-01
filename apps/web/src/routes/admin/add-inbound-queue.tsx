// biome-ignore-all lint/performance/noJsxPropsBind: Form controls use local state and intentional inline handlers.

import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import { PhoneCall } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { queryClient, queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/admin/add-inbound-queue")({
	validateSearch: (search: Record<string, unknown>) => ({
		edit: typeof search.edit === "string" ? search.edit : undefined,
	}),
	component: AddInboundQueuePage,
});

type Fields = {
	agent: string;
	agentPriority: boolean;
	agentRingTime: number;
	callbackCrossover: boolean;
	description: string;
	enableQueueUrl: boolean;
	enableRepeatCaller: boolean;
	followMe: string;
	followUserGroup: string;
	musicOnHold: string;
	name: string;
	pbxconfigId: string;
	positionAnnouncement: boolean;
	queueTimeout: number;
	ringStrategy: string;
	sbcMissedCallAgent: string;
	sbcMissedCallCaller: string;
	slaDuration: number;
	stickyAgent: boolean;
	transferCode: string;
	waitAnnouncement: boolean;
	webhookMissedCallAgent: string;
	webhookMissedCallCaller: string;
	welcomeAnnouncement: string;
};
const emptyInboundQueue = (): Fields => ({
	agent: "Select options",
	agentPriority: false,
	agentRingTime: 30,
	callbackCrossover: false,
	description: "",
	enableQueueUrl: false,
	enableRepeatCaller: false,
	followMe: "Select any Option",
	followUserGroup: "Hangup",
	musicOnHold: "Select any Option",
	name: "",
	pbxconfigId: "",
	positionAnnouncement: false,
	queueTimeout: 90,
	ringStrategy: "Random",
	sbcMissedCallAgent: "Select any Option",
	sbcMissedCallCaller: "Select any Option",
	slaDuration: 0,
	stickyAgent: false,
	transferCode: "",
	waitAnnouncement: false,
	webhookMissedCallAgent: "Select any Option",
	webhookMissedCallCaller: "Select any Option",
	welcomeAnnouncement: "Select any Option",
});
type TextKey = {
	[Key in keyof Fields]: Fields[Key] extends string ? Key : never;
}[keyof Fields];
type NumberKey = {
	[Key in keyof Fields]: Fields[Key] extends number ? Key : never;
}[keyof Fields];
type ToggleKey = {
	[Key in keyof Fields]: Fields[Key] extends boolean ? Key : never;
}[keyof Fields];
const imapOptions = ["Select any Option", "Enabled", "Disabled"];

function AddInboundQueuePage() {
	const { edit } = Route.useSearch();
	const {
		data: queue,
		error,
		isLoading,
	} = useQuery(
		queryUtils.inboundQueues.getById.queryOptions({
			input: { id: edit ?? "" },
			enabled: Boolean(edit),
		})
	);
	if (isLoading) {
		return <div className="p-6">Loading inbound queue...</div>;
	}
	if (error) {
		return (
			<div className="p-6 text-red-500">Unable to load inbound queue.</div>
		);
	}
	return (
		<InboundQueueForm
			mode={edit ? "edit" : "create"}
			queue={queue ?? undefined}
		/>
	);
}

function InboundQueueForm({
	mode,
	queue,
}: {
	mode: "create" | "edit";
	queue?: Fields & { id: string };
}) {
	const navigate = useNavigate();
	const [form, setForm] = useState<Fields>(() => {
		if (!queue) {
			return emptyInboundQueue();
		}
		const { id: _id, ...fields } = queue;
		return fields;
	});
	const update = <Key extends keyof Fields>(key: Key, value: Fields[Key]) =>
		setForm((current) => ({ ...current, [key]: value }));
	const createMutation = useMutation(
		queryUtils.inboundQueues.create.mutationOptions()
	);
	const updateMutation = useMutation(
		queryUtils.inboundQueues.update.mutationOptions()
	);
	const isSaving = createMutation.isPending || updateMutation.isPending;
	const save = async () => {
		if (!form.name.trim()) {
			return;
		}
		try {
			const payload = {
				...form,
				ringStrategy: form.ringStrategy as
					| "Random"
					| "Longest Wait Time"
					| "Round Robin",
			};
			if (queue) {
				await updateMutation.mutateAsync({ ...payload, id: queue.id });
			} else {
				await createMutation.mutateAsync(payload);
			}
			await queryClient.invalidateQueries({
				queryKey: queryUtils.inboundQueues.getAll.queryKey(),
			});
			navigate({ to: "/admin/show-inbound-queue" });
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save inbound queue."
			);
		}
	};
	const text = (key: TextKey, label: string) => (
		<Field
			label={label}
			onChange={(value) => update(key, value)}
			value={form[key]}
		/>
	);
	const number = (key: NumberKey, label: string) => (
		<Field
			label={label}
			onChange={(value) => update(key, Number(value) || 0)}
			type="number"
			value={form[key]}
		/>
	);
	const select = (key: TextKey, label: string, options: string[]) => (
		<SelectField
			label={label}
			onChange={(value) => update(key, value)}
			options={options}
			value={form[key]}
		/>
	);
	const toggle = (key: ToggleKey, label: string) => (
		<ToggleField
			checked={form[key]}
			label={label}
			onToggle={() => update(key, !form[key])}
		/>
	);
	const title = mode === "edit" ? "Edit Inbound Queue" : "Add Inbound Queue";

	return (
		<div className="flex min-h-svh flex-col bg-[#eef3f9] dark:bg-slate-950">
			<AdminTopbar />
			<main className="flex-1 p-4 md:p-6">
				<div className="mx-auto max-w-[1500px]">
					<div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757ff] dark:bg-blue-950 dark:text-blue-400">
							<PhoneCall className="size-4" />
						</div>
						<div>
							<h1 className="font-bold text-[#102b55] text-lg tracking-tight dark:text-white">
								{title}
							</h1>
							<p className="mt-0.5 text-slate-400 text-xs dark:text-slate-500">
								Create and configure a new inbound calling queue.
							</p>
						</div>
					</div>
					<section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<SectionHeader title="General Details" />
						<div className="grid gap-x-8 gap-y-5 p-5 md:grid-cols-2">
							<div className="space-y-5">
								{text("name", "Name*")}
								{select("ringStrategy", "Ring Strategy*", [
									"Random",
									"Longest Wait Time",
									"Round Robin",
								])}
								{number("agentRingTime", "Agent Ring Time*")}
								{select("followUserGroup", "Follow User Group*", [
									"Hangup",
									"Follow User Group",
								])}
								{toggle("stickyAgent", "Sticky Agent*")}
								{select(
									"sbcMissedCallCaller",
									"SBC 1 IMAP (Incoming Missed Call - Caller)",
									imapOptions
								)}
								{select(
									"sbcMissedCallAgent",
									"SBC 1 IMAP (Incoming Missed Call - Agent)",
									imapOptions
								)}
								{select(
									"webhookMissedCallCaller",
									"Webhook 1 IMAP (Incoming Missed Call - Caller)",
									imapOptions
								)}
								{text("transferCode", "Transfer Code")}
								{toggle("waitAnnouncement", "Wait Announcement")}
								{toggle("positionAnnouncement", "Position Announcement")}
							</div>
							<div className="space-y-5">
								{text("description", "Description")}
								{number("queueTimeout", "Queue Timeout (Seconds)*")}
								{select("musicOnHold", "Music On Hold", [
									"Select any Option",
									"Default",
									"Hold Music",
								])}
								{select("followMe", "Follow Me", imapOptions)}
								{toggle("enableRepeatCaller", "Enable Repeat Caller")}
								{select(
									"webhookMissedCallAgent",
									"Webhook 1 IMAP (Incoming Missed Call - Agent)",
									imapOptions
								)}
								{text("pbxconfigId", "PBXCONFIG ID")}
								{select("welcomeAnnouncement", "Welcome Announcement", [
									"Select any Option",
									"Default",
									"Custom",
								])}
								{toggle("enableQueueUrl", "Enable Queue URL")}
							</div>
						</div>
					</section>
					<section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<SectionHeader title="Agent Selection" />
						<div className="grid gap-5 p-5 md:grid-cols-2">
							{select("agent", "Agent*", [
								"Select options",
								"Meera",
								"CRLA Zainab",
								"CRLA Tasneem",
							])}
							{toggle("agentPriority", "Agent Priority")}
						</div>
					</section>
					<section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<SectionHeader title="Reporting Settings" />
						<div className="p-5">
							<div className="max-w-xl">
								{number("slaDuration", "SLA Duration (In Seconds)")}
							</div>
						</div>
					</section>
					<section className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<SectionHeader title="Callback Settings" />
						<div className="p-5">
							{toggle("callbackCrossover", "Callback Crossover")}
						</div>
					</section>
					<div className="mt-4 flex gap-2 pb-2">
						<Button
							className="h-9 rounded-lg bg-[#0757ff] px-5 text-xs shadow-blue-500/20 shadow-sm hover:bg-[#004be0] dark:bg-blue-600 dark:hover:bg-blue-500"
							disabled={!form.name.trim() || isSaving}
							onClick={save}
							type="button"
						>
							{mode === "edit" ? "Save Changes" : "Save"}
						</Button>
						<Button
							className="h-9 rounded-lg border-slate-200 px-5 text-slate-600 text-xs dark:border-slate-700 dark:text-slate-300"
							onClick={() => navigate({ to: "/admin/show-inbound-queue" })}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}

function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex items-center gap-2 border-slate-100 border-b px-5 py-3.5 dark:border-slate-800">
			<span className="h-5 w-1 rounded-full bg-[#0757ff] dark:bg-blue-500" />
			<h2 className="font-semibold text-[#102b55] text-sm dark:text-white">
				{title}
			</h2>
		</div>
	);
}
function Field({
	label,
	onChange,
	type = "text",
	value,
}: {
	label: string;
	onChange: (value: string) => void;
	type?: "number" | "text";
	value: number | string;
}) {
	const inputId = `inbound-queue-${label
		.toLowerCase()
		.replaceAll(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")}`;
	return (
		<div className="space-y-1.5">
			<label
				className="font-medium text-slate-500 text-xs dark:text-slate-400"
				htmlFor={inputId}
			>
				{label}
			</label>
			<Input
				className="h-9 rounded-lg border-slate-200 bg-white text-xs shadow-none focus:border-[#0757ff] focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500"
				id={inputId}
				onChange={(event) => onChange(event.target.value)}
				type={type}
				value={value}
			/>
		</div>
	);
}
function SelectField({
	label,
	onChange,
	options,
	value,
}: {
	label: string;
	onChange: (value: string) => void;
	options: string[];
	value: string;
}) {
	const inputId = `inbound-queue-${label
		.toLowerCase()
		.replaceAll(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")}`;
	return (
		<div className="space-y-1.5">
			<label
				className="font-medium text-slate-500 text-xs dark:text-slate-400"
				htmlFor={inputId}
			>
				{label}
			</label>
			<select
				className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-600 text-xs outline-none focus:border-[#0757ff] focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
				id={inputId}
				onChange={(event) => onChange(event.target.value)}
				value={value}
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}
function ToggleField({
	checked,
	label,
	onToggle,
}: {
	checked: boolean;
	label: string;
	onToggle: () => void;
}) {
	return (
		<div className="flex min-h-9 items-center justify-between gap-4">
			<span className="font-medium text-slate-600 text-xs dark:text-slate-300">
				{label}
			</span>
			<button
				aria-pressed={checked}
				className={`flex h-5 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors ${checked ? "justify-end bg-[#0757ff] dark:bg-blue-600" : "justify-start bg-slate-300 dark:bg-slate-700"}`}
				onClick={onToggle}
				type="button"
			>
				<span className="size-4 rounded-full bg-white shadow-sm" />
			</button>
		</div>
	);
}

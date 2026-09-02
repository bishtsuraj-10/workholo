import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "@workholo/ui/components/form/hooks";
import { type RefObject, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import {
	ACL_MODULES,
	type ACLPermission,
	type ACLRoute,
	findACLRoute,
} from "@/config/acl";

export const Route = createFileRoute("/admin/add-role")({
	component: AddRolePage,
});

type PermissionOption = {
	label: string;
	key: string;
};

type PermissionRow = {
	label: string;
	options: Array<PermissionOption | { label: "Select All" }>;
};

const permissionLabels: Record<ACLPermission, string> = {
	create: "Create",
	delete: "Delete",
	update: "Update",
	view: "View",
};

const selectAllOption = { label: "Select All" } as const;

const createPermissionRows = (routes: ACLRoute[]): PermissionRow[] =>
	routes.flatMap((route) => {
		if (route.hidden) {
			return [];
		}

		const options: PermissionRow["options"] = route.permissions.map(
			(permission) => ({
				key: `${route.id}.${permission}`,
				label: permissionLabels[permission],
			})
		);

		if (options.length > 1) {
			options.push(selectAllOption);
		}

		return [
			{
				label: route.name,
				options,
			},
			...createPermissionRows(route.children ?? []),
		];
	});

const outboundServices = findACLRoute("outbound-services");
const generalPermissions = createPermissionRows(
	ACL_MODULES.filter((route) => route.id !== "services")
).concat(
	createPermissionRows(
		(
			ACL_MODULES.find((route) => route.id === "services")?.children ?? []
		).filter((route) => route.id !== "outbound-services")
	)
);
const outboundPermissions = createPermissionRows(
	outboundServices?.children ?? []
);

const permissionSelectionKey = (
	row: PermissionRow,
	option: PermissionRow["options"][number]
) => ("key" in option ? option.key : `${row.label}|${option.label}`);

const roleFormSchema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	description: z.string().trim().min(1, "Description is required"),
	permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type RoleFormErrors = Partial<
	Record<keyof z.infer<typeof roleFormSchema>, string>
>;

function AddRolePage() {
	const [checked, setChecked] = useState<Record<string, boolean>>({});
	const [fieldErrors, setFieldErrors] = useState<RoleFormErrors>({});
	const [permissionError, setPermissionError] = useState<string | null>(null);
	const roleFormRef = useRef<HTMLFormElement>(null);
	const permissionsSectionRef = useRef<HTMLElement>(null);

	const allKeys = useMemo(
		() =>
			[...generalPermissions, ...outboundPermissions].flatMap((row) =>
				row.options
					.filter((option) => option.label !== "Select All")
					.map((option) => permissionSelectionKey(row, option))
			),
		[]
	);

	const toggle = (key: string, value?: boolean) => {
		setFieldErrors((errors) => ({ ...errors, permissions: undefined }));
		setPermissionError(null);
		setChecked((prev) => ({ ...prev, [key]: value ?? !prev[key] }));
	};

	const toggleRow = (row: PermissionRow, value: boolean) => {
		setFieldErrors((errors) => ({ ...errors, permissions: undefined }));
		setPermissionError(null);
		const rowKeys = row.options
			.filter((option) => option.label !== "Select All")
			.map((option) => permissionSelectionKey(row, option));
		setChecked((prev) => {
			const next = { ...prev };
			for (const key of rowKeys) {
				next[key] = value;
			}
			return next;
		});
	};

	const toggleEverything = (value: boolean) => {
		setFieldErrors((errors) => ({ ...errors, permissions: undefined }));
		setPermissionError(null);
		setChecked(Object.fromEntries(allKeys.map((key) => [key, value])));
	};

	const scrollToInvalidField = (fieldName: string) => {
		if (fieldName === "permissions") {
			permissionsSectionRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			permissionsSectionRef.current
				?.querySelector<HTMLInputElement>('input[type="checkbox"]')
				?.focus();
			return;
		}

		const field = roleFormRef.current?.elements.namedItem(fieldName);
		if (field instanceof HTMLElement) {
			field.scrollIntoView({ behavior: "smooth", block: "center" });
			field.focus();
		}
	};

	const form = useAppForm({
		defaultValues: {
			description: "",
			name: "",
		},
		onSubmit: ({ value }) => {
			const permissions = Object.entries(checked)
				.filter(([, selected]) => selected)
				.map(([permission]) => permission);
			const result = roleFormSchema.safeParse({ ...value, permissions });

			if (!result.success) {
				const requiresPermission = result.error.issues.some(
					(issue) => issue.path[0] === "permissions"
				);

				if (requiresPermission) {
					setPermissionError(
						result.error.issues.find((issue) => issue.path[0] === "permissions")
							?.message ?? "Select at least one permission"
					);
					permissionsSectionRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
					permissionsSectionRef.current
						?.querySelector<HTMLInputElement>('input[type="checkbox"]')
						?.focus();
				}

				return;
			}

			const role = result.data;
			setPermissionError(null);

			toast.success(`Role "${role.name}" is ready to be saved.`, {
				description: `${permissions.length} permission${permissions.length === 1 ? "" : "s"} selected.`,
			});
		},
		validators: {
			onSubmit: roleFormSchema.pick({ description: true, name: true }),
		},
	});

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<AdminTopbar />
			<main className="flex-1 bg-[#f4f7fb] p-4 md:p-6 dark:bg-slate-900">
				<section className="mx-auto max-w-[1600px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-slate-200/50 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
					<div className="flex items-center border-slate-200 border-b bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
						<div className="border-[#0757ff] border-l-4 pl-3">
							<h1 className="font-semibold text-[#102b55] text-base dark:text-white">
								Add a new Role
							</h1>
							<p className="mt-0.5 text-slate-400 text-xs dark:text-slate-500">
								Create a role and assign permissions
							</p>
						</div>
					</div>

					<form
						className="p-5 md:p-7"
						onSubmit={async (event) => {
							event.preventDefault();
							const formData = new FormData(event.currentTarget);
							const permissions = Object.entries(checked)
								.filter(([, selected]) => selected)
								.map(([permission]) => permission);
							const result = roleFormSchema.safeParse({
								description: formData.get("description"),
								name: formData.get("name"),
								permissions,
							});

							if (!result.success) {
								const validationErrors: RoleFormErrors = {};
								for (const issue of result.error.issues) {
									const [fieldName] = issue.path;
									if (
										fieldName === "description" ||
										fieldName === "name" ||
										fieldName === "permissions"
									) {
										validationErrors[fieldName] = issue.message;
									}
								}
								setFieldErrors(validationErrors);

								const [firstIssue] = result.error.issues;
								const [fieldName] = firstIssue?.path ?? [];
								const permissionIssue = result.error.issues.find(
									(validationIssue) =>
										validationIssue.path.at(0) === "permissions"
								);

								setPermissionError(permissionIssue?.message ?? null);

								if (typeof fieldName === "string") {
									scrollToInvalidField(fieldName);
								}
								return;
							}

							setFieldErrors({});
							setPermissionError(null);
							await form.handleSubmit();
						}}
						ref={roleFormRef}
					>
						<div className="grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-slate-50/60 p-5 md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900/40">
							<form.AppField name="name">
								{(field) => (
									<div
										className={
											fieldErrors.name
												? "[&_label]:text-red-600 dark:[&_label]:text-red-400"
												: undefined
										}
									>
										<field.Input
											aria-describedby={
												fieldErrors.name ? "role-name-error" : undefined
											}
											className={
												fieldErrors.name
													? "h-10 w-full rounded-lg border border-red-500 bg-white px-3 text-[#102b55] text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/10 dark:border-red-500 dark:bg-slate-950 dark:text-slate-100"
													: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[#102b55] text-sm outline-none transition focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
											}
											label="Name *"
											onInput={() =>
												setFieldErrors((errors) => ({
													...errors,
													name: undefined,
												}))
											}
										/>
										{fieldErrors.name ? (
											<p
												className="mt-1 text-red-600 text-xs dark:text-red-400"
												id="role-name-error"
												role="alert"
											>
												{fieldErrors.name}
											</p>
										) : null}
									</div>
								)}
							</form.AppField>
							<form.AppField name="description">
								{(field) => (
									<div
										className={
											fieldErrors.description
												? "[&_label]:text-red-600 dark:[&_label]:text-red-400"
												: undefined
										}
									>
										<field.Input
											aria-describedby={
												fieldErrors.description
													? "role-description-error"
													: undefined
											}
											className={
												fieldErrors.description
													? "h-10 w-full rounded-lg border border-red-500 bg-white px-3 text-[#102b55] text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/10 dark:border-red-500 dark:bg-slate-950 dark:text-slate-100"
													: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[#102b55] text-sm outline-none transition focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
											}
											label="Description *"
											onInput={() =>
												setFieldErrors((errors) => ({
													...errors,
													description: undefined,
												}))
											}
										/>
										{fieldErrors.description ? (
											<p
												className="mt-1 text-red-600 text-xs dark:text-red-400"
												id="role-description-error"
												role="alert"
											>
												{fieldErrors.description}
											</p>
										) : null}
									</div>
								)}
							</form.AppField>
						</div>

						<PermissionSection
							checked={checked}
							errorMessage={permissionError}
							rows={generalPermissions}
							sectionRef={permissionsSectionRef}
							title="General permissions"
							toggle={toggle}
							toggleEverything={toggleEverything}
							toggleRow={toggleRow}
						/>
						<PermissionSection
							checked={checked}
							rows={outboundPermissions}
							title="Outbound permissions"
							toggle={toggle}
							toggleRow={toggleRow}
						/>

						<div className="mt-8 flex items-center gap-3 border-slate-200 border-t pt-5 dark:border-slate-800">
							<button
								className="rounded-lg bg-[#0757ff] px-5 py-2.5 font-semibold text-white text-xs shadow-blue-500/20 shadow-sm transition hover:bg-[#0649d8] focus:outline-none focus:ring-2 focus:ring-[#0757ff]/20"
								type="submit"
							>
								Save
							</button>
							<button
								className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-600 text-xs transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
								onClick={() => history.back()}
								type="button"
							>
								Cancel
							</button>
						</div>
					</form>
				</section>
			</main>
		</div>
	);
}

function PermissionSection({
	title,
	rows,
	checked,
	errorMessage,
	toggle,
	toggleRow,
	toggleEverything,
	sectionRef,
}: {
	title: string;
	rows: PermissionRow[];
	checked: Record<string, boolean>;
	errorMessage?: string | null;
	toggle: (key: string, value?: boolean) => void;
	toggleRow: (row: PermissionRow, value: boolean) => void;
	toggleEverything?: (value: boolean) => void;
	sectionRef?: RefObject<HTMLElement | null>;
}) {
	return (
		<section
			className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
			ref={sectionRef}
		>
			{errorMessage ? (
				<p
					className="px-4 pt-3 pb-4 font-medium text-red-600 text-xs dark:text-red-400"
					role="alert"
				>
					{errorMessage}
				</p>
			) : null}
			<div className="flex items-center justify-between border-slate-200 border-b bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
				<h2 className="border-[#0757ff] border-l-3 pl-2 font-semibold text-[#102b55] text-sm dark:text-white">
					{title}
				</h2>
				{title === "General permissions" && (
					<span
						className="text-[#0757ff] text-xs"
						title="Select permissions for this role"
					>
						ⓘ
					</span>
				)}
			</div>

			{toggleEverything ? (
				<label className="mx-4 mt-4 mb-4 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-[#0757ff] text-xs dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
					<input
						checked={rows.every((row) =>
							row.options
								.filter((o) => o.label !== "Select All")
								.every((o) => checked[permissionSelectionKey(row, o)])
						)}
						className="size-4 accent-[#0757ff]"
						onChange={(e) => toggleEverything(e.target.checked)}
						type="checkbox"
					/>
					Select All
				</label>
			) : null}

			<div className="divide-y divide-slate-100 px-4 dark:divide-slate-800">
				{rows.map((row) => {
					const selectable = row.options.filter(
						(o) => o.label !== "Select All"
					);
					const allChecked =
						selectable.length > 0 &&
						selectable.every((o) => checked[permissionSelectionKey(row, o)]);
					return (
						<div
							className="grid grid-cols-1 items-start gap-3 py-4 md:grid-cols-[250px_minmax(0,1fr)] md:gap-5"
							key={row.label}
						>
							<div className="pt-0.5 font-semibold text-[#102b55] text-xs dark:text-slate-200">
								{row.label}
							</div>
							<div className="flex flex-wrap gap-x-5 gap-y-2.5">
								{row.options.map((option) => {
									const key = permissionSelectionKey(row, option);
									const isSelectAll = option.label === "Select All";
									return (
										<label
											className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] text-slate-600 transition hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
											key={key}
										>
											<input
												checked={isSelectAll ? allChecked : !!checked[key]}
												className="size-4 accent-[#0757ff]"
												onChange={(e) =>
													isSelectAll
														? toggleRow(row, e.target.checked)
														: toggle(key, e.target.checked)
												}
												type="checkbox"
											/>
											{option.label}
										</label>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}

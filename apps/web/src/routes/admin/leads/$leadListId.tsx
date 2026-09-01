// biome-ignore-all lint/performance/noJsxPropsBind: Table controls use local component state.

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import { Download, RotateCcw, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/admin/leads/$leadListId")({
	component: LeadListDetailsPage,
});

function LeadListDetailsPage() {
	const navigate = useNavigate();
	const { leadListId } = Route.useParams();
	const {
		data: leadList,
		error: leadListError,
		isLoading: isLeadListLoading,
	} = useQuery(
		queryUtils.leadLists.getById.queryOptions({ input: { id: leadListId } })
	);
	const {
		data: leads = [],
		error: leadsError,
		isLoading: areLeadsLoading,
	} = useQuery(
		queryUtils.leads.getByLeadListId.queryOptions({ input: { leadListId } })
	);
	const [search, setSearch] = useState("");
	const [leadStatus, setLeadStatus] = useState("All Statuses");
	const filteredLeads = useMemo(() => {
		const query = search.trim().toLowerCase();
		return leads.filter((lead) => {
			const matchesStatus =
				leadStatus === "All Statuses" || lead.leadStatus === leadStatus;
			const matchesSearch =
				!query ||
				[
					lead.phoneNumber,
					lead.name,
					lead.email,
					lead.address,
					lead.companyName,
					lead.alternatePhoneNumber,
					lead.dispositionList,
				]
					.join(" ")
					.toLowerCase()
					.includes(query);
			return matchesStatus && matchesSearch;
		});
	}, [leadStatus, leads, search]);
	const statuses = useMemo(
		() => ["All Statuses", ...new Set(leads.map((lead) => lead.leadStatus))],
		[leads]
	);
	const resetFilters = () => {
		setSearch("");
		setLeadStatus("All Statuses");
	};
	const exportLeads = () => {
		const headers = [
			"Phone Number",
			"Name",
			"Email Id",
			"Address",
			"Company Name",
			"Alternate Phone Number",
			"Lead Status",
			"Disposition List",
			"Call Count",
		];
		const rows = filteredLeads.map((lead) => [
			lead.phoneNumber,
			lead.name,
			lead.email,
			lead.address,
			lead.companyName,
			lead.alternatePhoneNumber,
			lead.leadStatus,
			lead.dispositionList,
			String(lead.callCount),
		]);
		const csv = [headers, ...rows]
			.map((row) =>
				row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")
			)
			.join("\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
		const download = document.createElement("a");
		download.href = url;
		download.download = `${leadList?.name ?? "lead-list"}-leads.csv`;
		download.click();
		URL.revokeObjectURL(url);
	};

	if (isLeadListLoading || areLeadsLoading) {
		return <div className="p-6">Loading lead list...</div>;
	}

	if (leadListError || leadsError || !leadList) {
		return (
			<MissingLeadList onBack={() => navigate({ to: "/admin/manage-leads" })} />
		);
	}

	return (
		<div className="min-h-svh bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />
			<main className="p-4 md:p-6">
				<div className="mx-auto max-w-[1500px]">
					<div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-[#0b1728]">
						<div>
							<p className="font-semibold text-[#0757ff] text-xs">
								Lead List Details
							</p>
							<h1 className="mt-1 font-bold text-[#102b55] text-xl tracking-tight dark:text-slate-100">
								{leadList.name}
							</h1>
							<p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
								{leadList.description ||
									"Manage and filter leads in this list."}
							</p>
						</div>
						<Button
							onClick={() => navigate({ to: "/admin/manage-leads" })}
							type="button"
							variant="outline"
						>
							Back to Lead Lists
						</Button>
					</div>
					<div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
						<div className="grid gap-3 md:grid-cols-[220px_1fr_auto_auto]">
							<select
								aria-label="Lead status"
								className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-700 text-xs outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
								onChange={(event) => setLeadStatus(event.target.value)}
								value={leadStatus}
							>
								{statuses.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
								<Input
									className="h-9 w-full rounded-lg border-slate-200 pl-8 text-xs dark:border-slate-700 dark:bg-slate-900"
									onChange={(event) => setSearch(event.target.value)}
									placeholder="Search leads..."
									value={search}
								/>
							</div>
							<Button onClick={resetFilters} type="button" variant="outline">
								<RotateCcw className="size-3.5" />
								Reset
							</Button>
							<Button onClick={exportLeads} type="button">
								<Download className="size-3.5" />
								Export
							</Button>
						</div>
					</div>
					<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
						<div className="flex items-center justify-between border-slate-100 border-b px-5 py-3.5 dark:border-slate-800">
							<div>
								<h2 className="font-semibold text-[#263b5b] text-sm dark:text-slate-100">
									Leads
								</h2>
								<p className="mt-0.5 text-slate-400 text-xs">
									{filteredLeads.length} matching leads
								</p>
							</div>
							<Users className="size-5 text-[#0757ff]" />
						</div>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[1350px] border-collapse text-xs">
								<thead>
									<tr className="border-slate-100 border-b bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/70">
										{[
											"S.No.",
											"Phone Number",
											"Name",
											"Email Id",
											"Address",
											"Company Name",
											"Alternate Phone Number",
											"Lead Status",
											"Disposition List",
											"Call Count",
											"Action",
										].map((heading) => (
											<th
												className="px-4 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300"
												key={heading}
											>
												{heading}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredLeads.map((lead, index) => (
										<tr
											className="border-slate-100 border-b transition-colors last:border-0 hover:bg-blue-50/30 dark:border-slate-800 dark:hover:bg-blue-950/30"
											key={lead.id}
										>
											<td className="px-4 py-3 text-slate-400">{index + 1}</td>
											<td className="px-4 py-3 font-medium text-[#0757ff] dark:text-blue-400">
												{lead.phoneNumber}
											</td>
											<td className="px-4 py-3 font-semibold text-[#263b5b] dark:text-slate-200">
												{lead.name}
											</td>
											<td className="px-4 py-3 text-slate-500 dark:text-slate-400">
												{lead.email}
											</td>
											<td className="px-4 py-3 text-slate-500 dark:text-slate-400">
												{lead.address}
											</td>
											<td className="px-4 py-3 text-slate-500 dark:text-slate-400">
												{lead.companyName}
											</td>
											<td className="px-4 py-3 text-slate-500 dark:text-slate-400">
												{lead.alternatePhoneNumber}
											</td>
											<td className="px-4 py-3">
												<span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-[#0757ff] text-[10px] dark:bg-blue-950/60 dark:text-blue-400">
													{lead.leadStatus}
												</span>
											</td>
											<td className="px-4 py-3 text-slate-500 dark:text-slate-400">
												{lead.dispositionList}
											</td>
											<td className="px-4 py-3 text-center font-semibold text-[#263b5b] dark:text-slate-200">
												{lead.callCount}
											</td>
											<td className="px-4 py-3">
												<Button size="sm" type="button" variant="outline">
													View
												</Button>
											</td>
										</tr>
									))}
									{filteredLeads.length === 0 ? (
										<tr>
											<td
												className="px-4 py-12 text-center text-slate-400"
												colSpan={11}
											>
												<Search className="mx-auto mb-2 size-7 text-slate-300" />
												<p className="font-medium text-slate-500">
													No leads found
												</p>
											</td>
										</tr>
									) : null}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

function MissingLeadList({ onBack }: { onBack: () => void }) {
	return (
		<div className="min-h-svh bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />
			<main className="p-6">
				<div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
					<h1 className="font-bold text-[#102b55] text-lg dark:text-slate-100">
						Lead list not found
					</h1>
					<p className="mt-2 text-slate-500 text-sm dark:text-slate-400">
						This lead list may have been deleted.
					</p>
					<Button className="mt-4" onClick={onBack} type="button">
						Back to Lead Lists
					</Button>
				</div>
			</main>
		</div>
	);
}

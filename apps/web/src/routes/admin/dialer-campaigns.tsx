// biome-ignore-all lint/performance/noJsxPropsBind: Table controls intentionally use component state.

import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@workholo/ui/components/alert-dialog";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import {
	ChevronLeft,
	ChevronRight,
	Plus,
	Search,
	Target,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { queryClient, queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/admin/dialer-campaigns")({
	component: DialerCampaignsPage,
});

function DialerCampaignsPage() {
	const navigate = useNavigate();
	const {
		data: campaigns = [],
		error,
		isLoading,
	} = useQuery(queryUtils.dialerCampaigns.getAll.queryOptions());
	const { data: leadLists = [] } = useQuery(
		queryUtils.leadLists.getAll.queryOptions()
	);
	const [search, setSearch] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [campaignToDelete, setCampaignToDelete] =
		useState<(typeof campaigns)[number]>();
	const deleteMutation = useMutation(
		queryUtils.dialerCampaigns.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: queryUtils.dialerCampaigns.getAll.queryKey(),
				});
				setCampaignToDelete(undefined);
			},
		})
	);
	const leadListNames = useMemo(
		() =>
			new Map(
				leadLists
					.filter((list): list is NonNullable<typeof list> => list !== null)
					.map((list) => [list.id, list.name])
			),
		[leadLists]
	);
	const filteredCampaigns = useMemo(() => {
		const query = search.trim().toLowerCase();
		return query
			? campaigns.filter((campaign) =>
					[
						campaign.name,
						campaign.dialStatus,
						campaign.leadListId ? leadListNames.get(campaign.leadListId) : "",
					]
						.join(" ")
						.toLowerCase()
						.includes(query)
				)
			: campaigns;
	}, [campaigns, leadListNames, search]);
	const totalPages = Math.max(
		1,
		Math.ceil(filteredCampaigns.length / pageSize)
	);
	const safePage = Math.min(currentPage, totalPages);
	const startIndex = (safePage - 1) * pageSize;
	const visibleCampaigns = filteredCampaigns.slice(
		startIndex,
		startIndex + pageSize
	);
	const activeCampaigns = campaigns.filter(
		(campaign) => campaign.dialStatus === "Active"
	).length;
	const totalActiveAgents = campaigns.reduce(
		(total, campaign) => total + (campaign.agent ? 1 : 0),
		0
	);
	const handleAction = (
		action: string,
		campaign: (typeof campaigns)[number]
	) => {
		if (action === "edit") {
			navigate({
				to: "/admin/add-dialer-campaign",
				search: { edit: campaign.id },
			});
		}
		if (action === "delete") {
			setCampaignToDelete(campaign);
		}
	};
	const deleteCampaign = () => {
		if (!campaignToDelete) {
			return;
		}
		deleteMutation.mutate({ id: campaignToDelete.id });
	};

	return (
		<div className="min-h-svh bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />
			<main className="p-4 md:p-6">
				<div className="mx-auto max-w-[1500px]">
					<div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-[#0b1728]">
						<div>
							<div className="flex items-center gap-2">
								<h1 className="font-bold text-[#102b55] text-xl tracking-tight dark:text-slate-100">
									Dialer Campaigns
								</h1>
								<span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-[#0757ff] text-[10px] dark:bg-blue-950/60 dark:text-blue-400">
									{campaigns.length} CAMPAIGNS
								</span>
							</div>
							<p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
								Manage outbound calling campaigns and active agents.
							</p>
						</div>
						<Button
							className="!rounded-lg !bg-[#0757ff] !text-white hover:!bg-[#004be0] dark:!bg-blue-600 dark:hover:!bg-blue-500 h-9 px-4 font-medium text-xs shadow-blue-500/20 shadow-sm"
							onClick={() =>
								navigate({
									to: "/admin/add-dialer-campaign",
									search: { edit: undefined },
								})
							}
							type="button"
						>
							<Plus className="mr-1.5 size-4" />
							Add Dialer Campaign
						</Button>
					</div>
					<div className="mb-4 grid gap-3 sm:grid-cols-3">
						<Stat
							icon={<Target className="size-4" />}
							label="Total Campaigns"
							value={campaigns.length}
						/>
						<Stat
							active
							icon={<span className="size-2.5 rounded-full bg-emerald-500" />}
							label="Active Campaigns"
							value={activeCampaigns}
						/>
						<Stat
							icon={<Users className="size-4" />}
							label="Active Agents"
							value={totalActiveAgents}
						/>
					</div>
					<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
						<div className="flex flex-col gap-3 border-slate-100 border-b px-5 py-3.5 md:flex-row md:items-center md:justify-between dark:border-slate-800">
							<label className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
								Show
								<select
									className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-slate-700 text-xs outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
									onChange={(event) => {
										setPageSize(Number(event.target.value));
										setCurrentPage(1);
									}}
									value={pageSize}
								>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
								</select>
								entries
							</label>
							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
								<Input
									className="h-8 w-full rounded-lg border-slate-200 pl-8 text-xs md:w-[240px] dark:border-slate-700 dark:bg-slate-900"
									onChange={(event) => {
										setSearch(event.target.value);
										setCurrentPage(1);
									}}
									placeholder="Search campaigns..."
									value={search}
								/>
							</div>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[1100px] border-collapse text-xs">
								<thead>
									<tr className="border-slate-100 border-b bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/70">
										{[
											"S.No",
											"Campaign Name",
											"Concurrent Limit",
											"Ring Timeout",
											"Lead List",
											"Status",
											"Calls Status",
											"Active Agents",
											"Action",
										].map((heading) => (
											<th
												className={`px-4 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300 ${heading === "Active Agents" ? "text-center" : ""}`}
												key={heading}
											>
												{heading}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{Boolean(isLoading) && (
										<tr>
											<td
												className="px-4 py-12 text-center text-slate-400"
												colSpan={9}
											>
												Loading campaigns...
											</td>
										</tr>
									)}
									{Boolean(error) && (
										<tr>
											<td
												className="px-4 py-12 text-center text-red-500"
												colSpan={9}
											>
												Unable to load campaigns.
											</td>
										</tr>
									)}
									{!(isLoading || error) &&
										visibleCampaigns.map((campaign, index) => (
											<tr
												className="border-slate-100 border-b transition-colors last:border-0 hover:bg-blue-50/30 dark:border-slate-800 dark:hover:bg-blue-950/30"
												key={campaign.id}
											>
												<td className="px-4 py-3 font-medium text-slate-500 dark:text-slate-400">
													{startIndex + index + 1}
												</td>
												<td className="px-4 py-3">
													<div className="flex items-center gap-2.5">
														<div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400">
															<Target className="size-3.5" />
														</div>
														<div>
															<div className="font-semibold text-[#263b5b] dark:text-slate-200">
																{campaign.name}
															</div>
															<div className="mt-0.5 font-mono text-[9px] text-slate-400">
																ID: {campaign.id}
															</div>
														</div>
													</div>
												</td>
												<td className="px-4 py-3 font-semibold text-[#102b55] dark:text-slate-200">
													{campaign.manualDialLimit}
												</td>
												<td className="px-4 py-3 text-slate-600 dark:text-slate-400">
													{campaign.ringTimeout}s
												</td>
												<td className="px-4 py-3">
													<button
														className="font-medium text-[#0757ff] hover:underline dark:text-blue-400"
														type="button"
													>
														{campaign.leadListId
															? (leadListNames.get(campaign.leadListId) ??
																"Unknown lead list")
															: "—"}
													</button>
												</td>
												<td className="px-4 py-3">
													<StatusBadge status={campaign.dialStatus} />
												</td>
												<td className="px-4 py-3 text-slate-500 dark:text-slate-400">
													{campaign.enableManualDial ? "Manual enabled" : "—"}
												</td>
												<td className="px-4 py-3 text-center">
													<span
														className={
															campaign.agent
																? "font-bold text-[#0757ff] dark:text-blue-400"
																: "text-slate-400"
														}
													>
														{campaign.agent ? 1 : 0}
													</span>
												</td>
												<td className="px-4 py-3">
													<select
														className="h-8 min-w-[120px] rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
														defaultValue=""
														onChange={(event) => {
															handleAction(event.target.value, campaign);
															event.target.value = "";
														}}
													>
														<option disabled value="">
															Select Action
														</option>
														<option value="edit">Edit</option>
														<option value="delete">Delete</option>
													</select>
												</td>
											</tr>
										))}
									{!(isLoading || error) && visibleCampaigns.length === 0 ? (
										<tr>
											<td
												className="px-4 py-12 text-center text-slate-400"
												colSpan={9}
											>
												<Search className="mx-auto mb-2 size-7 text-slate-300" />
												<p className="font-medium text-slate-500">
													No campaigns found
												</p>
											</td>
										</tr>
									) : null}
								</tbody>
							</table>
						</div>
						<div className="flex flex-col gap-3 border-slate-100 border-t px-5 py-3.5 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
							<span className="text-slate-400">
								Showing{" "}
								<strong className="text-slate-600 dark:text-slate-300">
									{filteredCampaigns.length ? startIndex + 1 : 0}
								</strong>{" "}
								to{" "}
								<strong className="text-slate-600 dark:text-slate-300">
									{Math.min(startIndex + pageSize, filteredCampaigns.length)}
								</strong>{" "}
								of{" "}
								<strong className="text-slate-600 dark:text-slate-300">
									{filteredCampaigns.length}
								</strong>{" "}
								entries
							</span>
							<div className="flex items-center gap-1.5">
								<PaginationButton
									disabled={safePage === 1}
									onClick={() => setCurrentPage(1)}
								>
									First
								</PaginationButton>
								<PaginationButton
									disabled={safePage === 1}
									onClick={() => setCurrentPage((page) => page - 1)}
								>
									<ChevronLeft className="size-3.5" />
									Previous
								</PaginationButton>
								<PaginationButton
									disabled={safePage === totalPages}
									onClick={() => setCurrentPage((page) => page + 1)}
								>
									Next
									<ChevronRight className="size-3.5" />
								</PaginationButton>
								<PaginationButton
									disabled={safePage === totalPages}
									onClick={() => setCurrentPage(totalPages)}
								>
									Last
								</PaginationButton>
							</div>
						</div>
					</div>
				</div>
			</main>
			<AlertDialog
				onOpenChange={(open) => {
					if (!open) {
						setCampaignToDelete(undefined);
					}
				}}
				open={Boolean(campaignToDelete)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete campaign?</AlertDialogTitle>
						<AlertDialogDescription>{`This will permanently remove ${campaignToDelete?.name ?? "this campaign"}.`}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={deleteMutation.isPending}
							onClick={deleteCampaign}
							variant="destructive"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function Stat({
	active = false,
	icon,
	label,
	value,
}: {
	active?: boolean;
	icon: React.ReactNode;
	label: string;
	value: number;
}) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
			<div className="flex items-center gap-3">
				<div
					className={`flex size-9 items-center justify-center rounded-lg ${active ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"}`}
				>
					{icon}
				</div>
				<div>
					<p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider">
						{label}
					</p>
					<p
						className={`font-bold text-lg ${active ? "text-emerald-600" : "text-[#102b55] dark:text-slate-100"}`}
					>
						{value}
					</p>
				</div>
			</div>
		</div>
	);
}
function StatusBadge({ status }: { status: string }) {
	const active = status === "Active";
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold text-[10px] ${active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}
		>
			<span
				className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`}
			/>
			{status}
		</span>
	);
}
function PaginationButton({
	children,
	disabled,
	onClick,
}: {
	children: React.ReactNode;
	disabled: boolean;
	onClick: () => void;
}) {
	return (
		<Button
			className="!rounded-lg h-8 border-slate-200 px-3 text-[11px] text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
			disabled={disabled}
			onClick={onClick}
			size="sm"
			type="button"
			variant="outline"
		>
			{children}
		</Button>
	);
}

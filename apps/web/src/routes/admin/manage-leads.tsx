// biome-ignore-all lint/performance/noJsxPropsBind: Table controls use local component state.

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
	FileText,
	List,
	Plus,
	Search,
	Upload,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import { queryClient, queryUtils } from "@/utils/orpc";

export const Route = createFileRoute("/admin/manage-leads")({
	component: ManageLeadsPage,
});

function ManageLeadsPage() {
	const navigate = useNavigate();
	const {
		data: leadLists = [],
		error,
		isLoading,
	} = useQuery(queryUtils.leadLists.getAll.queryOptions());
	const [search, setSearch] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [leadListToDelete, setLeadListToDelete] =
		useState<NonNullable<(typeof leadLists)[number]>>();
	const deleteMutation = useMutation(
		queryUtils.leadLists.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: queryUtils.leadLists.getAll.queryKey(),
				});
				setLeadListToDelete(undefined);
			},
		})
	);

	const resolvedLeadLists = leadLists.filter(
		(item): item is NonNullable<typeof item> => item !== null
	);
	const filteredLists = useMemo(() => {
		const value = search.trim().toLowerCase();

		if (!value) {
			return resolvedLeadLists;
		}

		return resolvedLeadLists.filter((item) =>
			`${item.name} ${item.description}`.toLowerCase().includes(value)
		);
	}, [resolvedLeadLists, search]);

	const totalPages = Math.max(1, Math.ceil(filteredLists.length / pageSize));

	const safePage = Math.min(currentPage, totalPages);

	const startIndex = (safePage - 1) * pageSize;

	const visibleLists = filteredLists.slice(startIndex, startIndex + pageSize);

	const totalLists = resolvedLeadLists.length;
	const navigateToDetails = (leadListId: string) =>
		navigate({ to: "/admin/leads/$leadListId", params: { leadListId } });
	const handleAction = (
		action: string,
		leadList: NonNullable<(typeof leadLists)[number]>
	) => {
		if (action === "view") {
			navigateToDetails(leadList.id);
		}
		if (action === "edit") {
			navigate({ to: "/admin/add-list", search: { edit: leadList.id } });
		}
		if (action === "delete") {
			setLeadListToDelete(leadList);
		}
	};
	const confirmDelete = () => {
		if (!leadListToDelete) {
			return;
		}
		deleteMutation.mutate({ id: leadListToDelete.id });
	};

	return (
		<div className="min-h-svh bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />

			<main className="p-4 md:p-6">
				<div className="mx-auto max-w-[1500px]">
					{/* PAGE HEADER */}
					<div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-[#0b1728]">
						<div>
							<div className="flex items-center gap-2">
								<h1 className="font-bold text-[#102b55] text-xl tracking-tight dark:text-slate-100">
									Lead Lists
								</h1>

								<span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-[#0757ff] text-[10px] dark:bg-blue-950/60 dark:text-blue-400">
									{totalLists} LISTS
								</span>
							</div>

							<p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
								Manage your lead lists, uploads and lead data.
							</p>
						</div>

						{/* HEADER BUTTONS */}
						<div className="flex flex-wrap gap-2">
							<Button
								className="h-9 rounded-lg border-slate-200 bg-white px-3 text-slate-600 text-xs shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
								onClick={() =>
									navigate({
										to: "/admin/upload-lead-logs",
									})
								}
								type="button"
								variant="outline"
							>
								<FileText className="mr-1.5 size-3.5" />
								Logs Of Upload Leads
							</Button>

							<Button
								className="h-9 rounded-lg border-slate-200 bg-white px-3 text-slate-600 text-xs shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
								type="button"
								variant="outline"
							>
								<Upload className="mr-1.5 size-3.5" />
								Master Upload
							</Button>

							<Button
								className="h-9 rounded-lg border-slate-200 bg-white px-3 text-slate-600 text-xs shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400"
								type="button"
								variant="outline"
							>
								Master Delete
							</Button>

							<Button
								className="h-9 rounded-lg bg-[#0757ff] px-4 font-medium text-white text-xs shadow-blue-500/20 shadow-sm transition-colors hover:bg-[#004be0] dark:bg-blue-600 dark:hover:bg-blue-500"
								onClick={() =>
									navigate({
										to: "/admin/add-list",
										search: { edit: undefined },
									})
								}
								type="button"
							>
								<Plus className="mr-1.5 size-4" />
								Add Lead List
							</Button>
						</div>
					</div>

					{/* SUMMARY */}
					<div className="mb-4 grid gap-3 sm:grid-cols-3">
						<div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
							<div className="flex items-center gap-3">
								<div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400">
									<List className="size-4" />
								</div>

								<div>
									<p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
										Total Lead Lists
									</p>

									<p className="font-bold text-[#102b55] text-lg dark:text-slate-100">
										{totalLists}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
							<div className="flex items-center gap-3">
								<div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
									<FileText className="size-4" />
								</div>

								<div>
									<p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
										Visible Lists
									</p>

									<p className="font-bold text-[#102b55] text-lg dark:text-slate-100">
										{filteredLists.length}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
							<div className="flex items-center gap-3">
								<div className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
									<Upload className="size-4" />
								</div>

								<div>
									<p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
										Lead Management
									</p>

									<p className="font-bold text-[#102b55] text-lg dark:text-slate-100">
										Active
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* MAIN CARD */}
					<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
						{/* CONTROLS */}
						<div className="flex flex-col gap-3 border-slate-100 border-b px-5 py-3.5 md:flex-row md:items-center md:justify-between dark:border-slate-800">
							<div className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
								<span>Show</span>

								<select
									className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-slate-700 text-xs outline-none focus:border-[#0757ff] focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-blue-500"
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

								<span>entries</span>
							</div>

							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

								<Input
									className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs md:w-[240px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
									onChange={(event) => {
										setSearch(event.target.value);
										setCurrentPage(1);
									}}
									placeholder="Search lead lists..."
									value={search}
								/>
							</div>
						</div>

						{/* TABLE */}
						<div className="overflow-x-auto">
							<table className="w-full min-w-[800px] border-collapse text-xs">
								<thead>
									<tr className="border-slate-100 border-b bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/70">
										<th className="w-[90px] px-4 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											S.No.
										</th>

										<th className="px-4 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Lead List
										</th>

										<th className="px-4 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Description
										</th>

										<th className="w-[180px] px-4 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Action
										</th>
									</tr>
								</thead>

								<tbody>
									{Boolean(isLoading) && (
										<tr>
											<td
												className="px-4 py-12 text-center text-slate-400"
												colSpan={4}
											>
												Loading lead lists...
											</td>
										</tr>
									)}
									{Boolean(error) && (
										<tr>
											<td
												className="px-4 py-12 text-center text-red-500"
												colSpan={4}
											>
												Unable to load lead lists.
											</td>
										</tr>
									)}
									{!(isLoading || error) &&
										visibleLists.map((item, index) => (
											<tr
												className="border-slate-100 border-b transition-colors last:border-0 hover:bg-blue-50/30 dark:border-slate-800 dark:hover:bg-blue-950/30"
												key={item.id}
											>
												<td className="px-4 py-3 font-medium text-slate-400 dark:text-slate-500">
													{startIndex + index + 1}
												</td>

												<td className="px-4 py-3">
													<div className="flex items-center gap-2.5">
														<div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400">
															<List className="size-3.5" />
														</div>

														<button
															className="font-semibold text-[#0757ff] hover:underline dark:text-blue-400"
															onClick={() => navigateToDetails(item.id)}
															type="button"
														>
															{item.name}
														</button>
													</div>
												</td>

												<td className="px-4 py-3 text-slate-500 dark:text-slate-400">
													{item.description}
												</td>

												<td className="px-4 py-3">
													<select
														className="h-8 min-w-[125px] rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600 outline-none transition hover:border-blue-200 focus:border-[#0757ff] focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-blue-500 dark:hover:border-blue-800"
														defaultValue=""
														onChange={(event) => {
															handleAction(event.target.value, item);
															event.target.value = "";
														}}
													>
														<option disabled value="">
															Select Action
														</option>

														<option value="view">View</option>
														<option value="edit">Edit</option>
														<option value="upload">Upload</option>
														<option value="delete">Delete</option>
													</select>
												</td>
											</tr>
										))}

									{!(isLoading || error) && visibleLists.length === 0 && (
										<tr>
											<td
												className="px-4 py-12 text-center text-slate-400 dark:text-slate-500"
												colSpan={4}
											>
												<Search className="mx-auto mb-2 size-7 text-slate-300 dark:text-slate-600" />

												<p className="font-medium text-slate-500 dark:text-slate-400">
													No lead lists found
												</p>

												<p className="mt-1 text-slate-400 text-xs dark:text-slate-500">
													Try changing your search.
												</p>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* FOOTER */}
						<div className="flex flex-col gap-3 border-slate-100 border-t px-5 py-3.5 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
							<span className="text-slate-400 dark:text-slate-500">
								Showing{" "}
								<span className="font-semibold text-slate-600 dark:text-slate-300">
									{filteredLists.length === 0 ? 0 : startIndex + 1}
								</span>{" "}
								to{" "}
								<span className="font-semibold text-slate-600 dark:text-slate-300">
									{Math.min(startIndex + pageSize, filteredLists.length)}
								</span>{" "}
								of{" "}
								<span className="font-semibold text-slate-600 dark:text-slate-300">
									{filteredLists.length}
								</span>{" "}
								entries
							</span>

							<div className="flex items-center gap-1.5">
								<Button
									className="h-8 rounded-lg border-slate-200 bg-white px-3 text-[11px] text-slate-500 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
									disabled={safePage === 1}
									onClick={() => setCurrentPage(1)}
									size="sm"
									type="button"
									variant="outline"
								>
									First
								</Button>

								<Button
									className="h-8 rounded-lg border-slate-200 bg-white px-3 text-[11px] text-slate-500 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
									disabled={safePage === 1}
									onClick={() =>
										setCurrentPage((page) => Math.max(1, page - 1))
									}
									size="sm"
									type="button"
									variant="outline"
								>
									<ChevronLeft className="mr-1 size-3.5" />
									Previous
								</Button>

								{Array.from(
									{ length: totalPages },
									(_, index) => index + 1
								).map((page) => (
									<Button
										className={
											page === safePage
												? "h-8 min-w-8 rounded-lg bg-[#0757ff] px-2 font-medium text-[11px] text-white shadow-sm hover:bg-[#004be0] dark:bg-blue-600 dark:hover:bg-blue-500"
												: "h-8 min-w-8 rounded-lg border-slate-200 bg-white px-2 text-[11px] text-slate-500 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
										}
										key={page}
										onClick={() => setCurrentPage(page)}
										size="sm"
										type="button"
										variant={page === safePage ? "default" : "outline"}
									>
										{page}
									</Button>
								))}

								<Button
									className="h-8 rounded-lg border-slate-200 bg-white px-3 text-[11px] text-slate-500 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
									disabled={safePage === totalPages}
									onClick={() =>
										setCurrentPage((page) => Math.min(totalPages, page + 1))
									}
									size="sm"
									type="button"
									variant="outline"
								>
									Next
									<ChevronRight className="ml-1 size-3.5" />
								</Button>

								<Button
									className="h-8 rounded-lg border-slate-200 bg-white px-3 text-[11px] text-slate-500 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
									disabled={safePage === totalPages}
									onClick={() => setCurrentPage(totalPages)}
									size="sm"
									type="button"
									variant="outline"
								>
									Last
								</Button>
							</div>
						</div>
					</div>
				</div>
			</main>
			<AlertDialog
				onOpenChange={(open) => {
					if (!open) {
						setLeadListToDelete(undefined);
					}
				}}
				open={Boolean(leadListToDelete)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete lead list?</AlertDialogTitle>
						<AlertDialogDescription>{`This will permanently remove ${leadListToDelete?.name ?? "this lead list"}.`}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={deleteMutation.isPending}
							onClick={confirmDelete}
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

// biome-ignore-all lint/performance/noJsxPropsBind: Table controls use local component state.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";

export const Route = createFileRoute("/admin/all-roles-and-permissions")({
	component: AllRolesAndPermissionsPage,
});

type Role = {
	id: number;
	name: string;
	description: string;
};

const roles: Role[] = [
	{ id: 1, name: "Supervisor", description: "Supervisor" },
	{
		id: 2,
		name: "Account Administrator",
		description: "Account Administrator",
	},
	{ id: 3, name: "Agent", description: "Agent" },
	{ id: 4, name: "Dialer Role", description: "Dialer Role" },
	{ id: 5, name: "TL Role", description: "TL" },
	{ id: 6, name: "Admin Role New", description: "Admin Role New" },
];

function AllRolesAndPermissionsPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [openAction, setOpenAction] = useState<number | null>(null);

	const filteredRoles = useMemo(() => {
		const value = search.trim().toLowerCase();

		if (!value) {
			return roles;
		}

		return roles.filter((role) =>
			`${role.id} ${role.name} ${role.description}`
				.toLowerCase()
				.includes(value)
		);
	}, [search]);

	const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));
	const safePage = Math.min(currentPage, totalPages);
	const startIndex = (safePage - 1) * pageSize;
	const visibleRoles = filteredRoles.slice(startIndex, startIndex + pageSize);

	const firstShown = filteredRoles.length === 0 ? 0 : startIndex + 1;
	const lastShown = Math.min(startIndex + pageSize, filteredRoles.length);

	const goFirst = () => setCurrentPage(1);
	const goPrevious = () => setCurrentPage((page) => Math.max(1, page - 1));
	const goNext = () => setCurrentPage((page) => Math.min(totalPages, page + 1));
	const goLast = () => setCurrentPage(totalPages);

	const handlePageSizeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setPageSize(Number(event.target.value));
		setCurrentPage(1);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setCurrentPage(1);
	};

	const openAddRole = () => {
		navigate({ to: "/admin/add-role" });
	};

	return (
		<div className="flex min-h-svh flex-col bg-[#f4f7fb] dark:bg-[#07111f]">
			<AdminTopbar />

			<main className="flex-1 bg-[#f4f7fb] p-4 md:p-6 dark:bg-[#07111f]">
				<div className="mx-auto max-w-[1600px]">
					<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-slate-200/50 shadow-sm dark:border-slate-800 dark:bg-[#0b1728] dark:shadow-none">
						{/* Page header */}
						<div className="flex items-center justify-between border-slate-200 border-b bg-white px-5 py-4 dark:border-slate-800 dark:bg-[#0b1728]">
							<h1 className="border-[#0757ff] border-l-4 pl-3 font-semibold text-[#102b55] text-base dark:text-white">
								List of all Roles
							</h1>

							<Button
								className="h-9 gap-1.5 rounded-lg bg-[#0757ff] px-4 font-semibold text-white text-xs shadow-blue-500/20 shadow-sm hover:bg-[#0649d8] dark:bg-blue-600 dark:hover:bg-blue-500"
								onClick={openAddRole}
								type="button"
							>
								<Plus className="h-3.5 w-3.5" />
								Add Role
							</Button>
						</div>

						{/* Table controls */}
						<div className="flex flex-col gap-4 border-slate-100 border-b bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/30">
							<div className="flex items-center gap-2 text-slate-600 text-xs dark:text-slate-300">
								<span>Show</span>

								<select
									aria-label="Rows per page"
									className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-700 text-xs outline-none transition focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
									onChange={handlePageSizeChange}
									value={pageSize}
								>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
									<option value={100}>100</option>
								</select>

								<span>entries</span>
							</div>

							<div className="flex items-center gap-2">
								<label
									className="text-slate-600 text-xs dark:text-slate-300"
									htmlFor="roles-search"
								>
									Search:
								</label>

								<div className="relative">
									<Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
									<Input
										className="h-9 w-[240px] rounded-lg border-slate-200 pl-8 text-xs shadow-none focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700"
										id="roles-search"
										onChange={handleSearchChange}
										value={search}
									/>
								</div>
							</div>
						</div>

						{/* Roles table */}
						<div className="overflow-x-auto">
							<table className="w-full min-w-[720px] border-collapse text-xs">
								<thead>
									<tr className="bg-[#f5f8fc] text-left dark:bg-slate-900/70">
										<th className="w-[120px] border-slate-200 border-b px-4 py-3 font-semibold text-[#102b55] text-xs dark:border-slate-800 dark:text-slate-300">
											Id
										</th>
										<th className="border-slate-200 border-b px-4 py-3 font-semibold text-[#102b55] text-xs dark:border-slate-800 dark:text-slate-300">
											Name
										</th>
										<th className="border-slate-200 border-b px-4 py-3 font-semibold text-[#102b55] text-xs dark:border-slate-800 dark:text-slate-300">
											Description
										</th>
										<th className="w-[180px] border-slate-200 border-b px-4 py-3 font-semibold text-[#102b55] text-xs dark:border-slate-800 dark:text-slate-300">
											Actions
										</th>
									</tr>
								</thead>

								<tbody>
									{visibleRoles.map((role) => (
										<tr
											className="transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-900/50"
											key={role.id}
										>
											<td className="border-slate-100 border-b px-4 py-3 text-slate-600 dark:border-slate-800 dark:text-slate-300">
												{role.id}
											</td>
											<td className="border-slate-100 border-b px-4 py-3 font-medium text-[#102b55] dark:border-slate-800 dark:text-slate-200">
												{role.name}
											</td>
											<td className="border-slate-100 border-b px-4 py-3 text-slate-600 dark:border-slate-800 dark:text-slate-300">
												{role.description}
											</td>
											<td className="relative border-slate-100 border-b px-4 py-2 dark:border-slate-800">
												<div className="relative inline-block">
													<button
														aria-expanded={openAction === role.id}
														className="h-9 min-w-[130px] rounded-lg border border-slate-200 bg-white px-3 text-left font-medium text-[11px] text-slate-600 shadow-sm transition hover:border-[#0757ff]/40 hover:bg-blue-50/40 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
														onClick={() =>
															setOpenAction(
																openAction === role.id ? null : role.id
															)
														}
														type="button"
													>
														Select an Action
													</button>

													{openAction === role.id && (
														<div className="absolute top-10 left-0 z-20 w-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
															<button
																className="block w-full px-3 py-2.5 text-left text-slate-700 text-xs transition hover:bg-blue-50 hover:text-[#0757ff] dark:text-slate-200 dark:hover:bg-slate-800"
																onClick={() => setOpenAction(null)}
																type="button"
															>
																View Role
															</button>
															<button
																className="block w-full px-3 py-2.5 text-left text-slate-700 text-xs transition hover:bg-blue-50 hover:text-[#0757ff] dark:text-slate-200 dark:hover:bg-slate-800"
																onClick={() => setOpenAction(null)}
																type="button"
															>
																Clone Role
															</button>
														</div>
													)}
												</div>
											</td>
										</tr>
									))}

									{visibleRoles.length === 0 && (
										<tr>
											<td
												className="border-slate-200 border-b px-4 py-10 text-center text-slate-500 text-xs dark:border-slate-800"
												colSpan={4}
											>
												No matching roles found.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* Footer / pagination */}
						<div className="flex flex-col gap-3 border-slate-100 border-t bg-white px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0b1728]">
							<p className="text-slate-500 dark:text-slate-400">
								Showing {firstShown} to {lastShown} of {filteredRoles.length}{" "}
								entries
							</p>

							<div className="flex items-center gap-1">
								<Button
									aria-label="First page"
									className="h-8 rounded-lg border-slate-200 px-2 text-xs shadow-none hover:border-[#0757ff]/40 hover:text-[#0757ff] dark:border-slate-700"
									disabled={safePage === 1}
									onClick={goFirst}
									size="sm"
									type="button"
									variant="outline"
								>
									<ChevronLeft className="h-3.5 w-3.5" />
									<ChevronLeft className="-ml-2 h-3.5 w-3.5" />
								</Button>

								<Button
									className="h-8 rounded-lg border-slate-200 px-3 text-xs shadow-none hover:border-[#0757ff]/40 hover:text-[#0757ff] dark:border-slate-700"
									disabled={safePage === 1}
									onClick={goPrevious}
									size="sm"
									type="button"
									variant="outline"
								>
									Previous
								</Button>

								<Button
									className="h-8 min-w-8 rounded-lg bg-[#0757ff] px-2 font-semibold text-white text-xs shadow-blue-500/20 shadow-sm hover:bg-[#0649d8] dark:bg-blue-600 dark:hover:bg-blue-500"
									onClick={goFirst}
									size="sm"
									type="button"
								>
									{safePage}
								</Button>

								<Button
									className="h-8 rounded-lg border-slate-200 px-3 text-xs shadow-none hover:border-[#0757ff]/40 hover:text-[#0757ff] dark:border-slate-700"
									disabled={safePage === totalPages}
									onClick={goNext}
									size="sm"
									type="button"
									variant="outline"
								>
									Next
								</Button>

								<Button
									aria-label="Last page"
									className="h-8 rounded-lg border-slate-200 px-2 text-xs shadow-none hover:border-[#0757ff]/40 hover:text-[#0757ff] dark:border-slate-700"
									disabled={safePage === totalPages}
									onClick={goLast}
									size="sm"
									type="button"
									variant="outline"
								>
									<ChevronRight className="h-3.5 w-3.5" />
									<ChevronRight className="-ml-2 h-3.5 w-3.5" />
								</Button>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}

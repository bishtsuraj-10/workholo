"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import {
	ChevronLeft,
	ChevronRight,
	Globe2,
	Plus,
	Search,
	Server,
	ShieldCheck,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";

export const Route = createFileRoute("/admin/ip-pool-whitelisting")({
	component: IpPoolWhitelistingPage,
});

type IpPool = {
	id: number;
	name: string;
	description: string;
	type: "Single IP" | "Multiple IP";
	ips: string;
	assignedTo: string;
};

const ipPools: IpPool[] = [];

function IpPoolWhitelistingPage() {
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState<"users" | "extension">("users");
	const [search, setSearch] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const filteredPools = useMemo(() => {
		const value = search.trim().toLowerCase();

		if (!value) {
			return ipPools;
		}

		return ipPools.filter((pool) =>
			`${pool.id} ${pool.name} ${pool.description} ${pool.type} ${pool.ips} ${pool.assignedTo}`
				.toLowerCase()
				.includes(value)
		);
	}, [search]);

	const totalPages = Math.max(1, Math.ceil(filteredPools.length / pageSize));

	const safePage = Math.min(currentPage, totalPages);
	const startIndex = (safePage - 1) * pageSize;

	const visiblePools = filteredPools.slice(startIndex, startIndex + pageSize);

	const firstShown = filteredPools.length === 0 ? 0 : startIndex + 1;

	const lastShown = Math.min(startIndex + pageSize, filteredPools.length);

	const goFirst = () => setCurrentPage(1);

	const goPrevious = () => {
		setCurrentPage((page) => Math.max(1, page - 1));
	};

	const goNext = () => {
		setCurrentPage((page) => Math.min(totalPages, page + 1));
	};

	const goLast = () => setCurrentPage(totalPages);

	return (
		<div className="flex min-h-svh flex-col bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />

			<main className="flex-1 p-4 md:p-5 lg:p-6">
				<div className="mx-auto w-full max-w-[1600px]">
					<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-[#0b1728]">
						{/* ================================================= */}
						{/* HEADER */}
						{/* ================================================= */}

						<div className="flex flex-col gap-3 border-slate-200 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
							<div className="flex items-center gap-3">
								<div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757ff] dark:bg-blue-950/40 dark:text-blue-400">
									<ShieldCheck className="size-4" />
								</div>

								<div>
									<h1 className="font-semibold text-[#102b55] text-sm dark:text-white">
										IP Pool Whitelisting
									</h1>

									<p className="mt-0.5 text-[11px] text-slate-400">
										Manage trusted IP addresses and access pools
									</p>
								</div>
							</div>

							<Button
								className="h-9 rounded-lg border border-[#0757ff] bg-[#0757ff] px-4 font-medium text-white text-xs shadow-blue-500/20 shadow-sm transition-all hover:bg-[#004be0] hover:shadow-blue-500/20 hover:shadow-md"
								onClick={() =>
									navigate({
										to: "/admin/add-new-ip-pool",
									})
								}
								type="button"
							>
								<Plus className="mr-1.5 size-3.5" />
								Add IP Pool
							</Button>
						</div>

						{/* ================================================= */}
						{/* TABS */}
						{/* ================================================= */}

						<div className="px-5 pt-5">
							<div className="flex gap-1 border-slate-200 border-b dark:border-slate-800">
								<TabButton
									active={activeTab === "users"}
									icon={Users}
									label="Users"
									onClick={() => {
										setActiveTab("users");
										setCurrentPage(1);
									}}
								/>

								<TabButton
									active={activeTab === "extension"}
									icon={Server}
									label="Extension"
									onClick={() => {
										setActiveTab("extension");
										setCurrentPage(1);
									}}
								/>
							</div>
						</div>

						{/* ================================================= */}
						{/* TABLE TOOLBAR */}
						{/* ================================================= */}

						<div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
								<span>Show</span>

								<div className="relative">
									<select
										aria-label="Rows per page"
										className="h-8 appearance-none rounded-lg border border-slate-200 bg-slate-50 py-0 pr-7 pl-3 text-slate-700 text-xs outline-none transition focus:border-[#0757ff] focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
										onChange={(event) => {
											setPageSize(Number(event.target.value));
											setCurrentPage(1);
										}}
										value={pageSize}
									>
										<option value={10}>10</option>
										<option value={25}>25</option>
										<option value={50}>50</option>
										<option value={100}>100</option>
									</select>

									<ChevronRight className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 rotate-90 text-slate-400" />
								</div>

								<span>entries</span>
							</div>

							<div className="flex items-center gap-2">
								<label
									className="font-medium text-slate-500 text-xs dark:text-slate-400"
									htmlFor="ip-pool-search"
								>
									Search
								</label>

								<div className="relative">
									<Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-3.5 -translate-y-1/2 text-slate-400" />

									<Input
										className="h-9 w-full rounded-lg border-slate-200 bg-slate-50 pr-3 pl-9 text-xs shadow-none outline-none transition placeholder:text-slate-400 focus:border-[#0757ff] focus:bg-white focus:ring-2 focus:ring-blue-500/10 sm:w-[240px] dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-950"
										id="ip-pool-search"
										onChange={(event) => {
											setSearch(event.target.value);
											setCurrentPage(1);
										}}
										placeholder="Search IP pools..."
										value={search}
									/>
								</div>
							</div>
						</div>

						{/* ================================================= */}
						{/* TABLE */}
						{/* ================================================= */}

						<div className="px-5">
							<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
								<div className="overflow-x-auto">
									<table className="w-full min-w-[1000px] border-collapse text-xs">
										<thead>
											<tr className="bg-slate-50 dark:bg-slate-900/70">
												<TableHeader className="w-[70px]" label="S.No" />

												<TableHeader label="Name" />

												<TableHeader label="Description" />

												<TableHeader label="Type" />

												<TableHeader label="IP(s)" />

												<TableHeader label="Assigned To" />

												<TableHeader className="w-[150px]" label="Action" />
											</tr>
										</thead>

										<tbody>
											{visiblePools.map((pool) => (
												<tr
													className="group transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/10"
													key={pool.id}
												>
													<TableCell>
														<span className="text-slate-500 dark:text-slate-400">
															{pool.id}
														</span>
													</TableCell>

													<TableCell>
														<div className="flex items-center gap-2">
															<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#0757ff] dark:bg-blue-950/40 dark:text-blue-400">
																<Globe2 className="size-3.5" />
															</div>

															<span className="font-medium text-slate-700 dark:text-slate-200">
																{pool.name}
															</span>
														</div>
													</TableCell>

													<TableCell>
														<span className="text-slate-500 dark:text-slate-400">
															{pool.description}
														</span>
													</TableCell>

													<TableCell>
														<span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 font-medium text-[#0757ff] text-[10px] dark:bg-blue-950/40 dark:text-blue-400">
															{pool.type}
														</span>
													</TableCell>

													<TableCell>
														<span className="font-mono text-slate-600 dark:text-slate-300">
															{pool.ips}
														</span>
													</TableCell>

													<TableCell>
														<span className="text-slate-600 dark:text-slate-300">
															{pool.assignedTo}
														</span>
													</TableCell>

													<TableCell>
														<button
															className="font-medium text-[#0757ff] transition-colors hover:text-[#004be0] hover:underline dark:text-blue-400"
															type="button"
														>
															Select an Action
														</button>
													</TableCell>
												</tr>
											))}

											{visiblePools.length === 0 && (
												<tr>
													<td
														className="border-slate-200 border-t px-4 py-16 dark:border-slate-800"
														colSpan={7}
													>
														<div className="flex flex-col items-center justify-center">
															<div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
																<Server className="size-5" />
															</div>

															<p className="font-medium text-slate-600 text-sm dark:text-slate-300">
																No IP pools found
															</p>

															<p className="mt-1 text-slate-400 text-xs">
																There are no IP pools available to display.
															</p>

															{search && (
																<button
																	className="mt-3 font-medium text-[#0757ff] text-xs hover:underline"
																	onClick={() => setSearch("")}
																	type="button"
																>
																	Clear search
																</button>
															)}
														</div>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>

						{/* ================================================= */}
						{/* FOOTER / PAGINATION */}
						{/* ================================================= */}

						<div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-slate-500 text-xs dark:text-slate-400">
								Showing{" "}
								<span className="font-medium text-slate-700 dark:text-slate-200">
									{firstShown}
								</span>{" "}
								to{" "}
								<span className="font-medium text-slate-700 dark:text-slate-200">
									{lastShown}
								</span>{" "}
								of{" "}
								<span className="font-medium text-slate-700 dark:text-slate-200">
									{filteredPools.length}
								</span>{" "}
								entries
							</p>

							<div className="flex items-center gap-1.5">
								<PaginationButton disabled={safePage === 1} onClick={goFirst}>
									First
								</PaginationButton>

								<PaginationButton
									disabled={safePage === 1}
									onClick={goPrevious}
								>
									<ChevronLeft className="size-3.5" />
									<span className="hidden sm:inline">Previous</span>
								</PaginationButton>

								<span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#0757ff] px-2.5 font-medium text-white text-xs shadow-blue-500/20 shadow-sm">
									{safePage}
								</span>

								<PaginationButton
									disabled={safePage === totalPages}
									onClick={goNext}
								>
									<span className="hidden sm:inline">Next</span>
									<ChevronRight className="size-3.5" />
								</PaginationButton>

								<PaginationButton
									disabled={safePage === totalPages}
									onClick={goLast}
								>
									Last
								</PaginationButton>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}

/* ============================================================= */
/* TAB BUTTON */
/* ============================================================= */

function TabButton({
	active,
	icon: Icon,
	label,
	onClick,
}: {
	active: boolean;
	icon: typeof Users;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			className={`relative flex h-10 items-center gap-2 px-5 font-medium text-xs transition-all ${
				active
					? "text-[#0757ff] dark:text-blue-400"
					: "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
			}`}
			onClick={onClick}
			type="button"
		>
			<Icon className="size-3.5" />

			{label}

			{active && (
				<span className="absolute right-0 bottom-[-1px] left-0 h-0.5 rounded-full bg-[#0757ff] dark:bg-blue-400" />
			)}
		</button>
	);
}

/* ============================================================= */
/* TABLE HEADER */
/* ============================================================= */

function TableHeader({
	label,
	className = "",
}: {
	label: string;
	className?: string;
}) {
	return (
		<th
			className={`border-slate-200 border-b px-3 py-3.5 text-left font-semibold text-[10px] text-slate-500 uppercase tracking-wide dark:border-slate-800 dark:text-slate-400 ${className}`}
		>
			{label}
		</th>
	);
}

/* ============================================================= */
/* TABLE CELL */
/* ============================================================= */

function TableCell({ children }: { children: React.ReactNode }) {
	return (
		<td className="border-slate-100 border-b px-3 py-3.5 dark:border-slate-800">
			{children}
		</td>
	);
}

/* ============================================================= */
/* PAGINATION BUTTON */
/* ============================================================= */

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
			className="h-8 rounded-lg border-slate-200 bg-white px-2.5 font-medium text-[11px] text-slate-600 shadow-none transition-all hover:border-[#0757ff]/30 hover:bg-blue-50 hover:text-[#0757ff] disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
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

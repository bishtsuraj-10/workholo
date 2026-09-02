// biome-ignore-all lint/performance/noJsxPropsBind: Table controls use local component state.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";

export const Route = createFileRoute("/admin/show-member")({
	component: ShowMemberPage,
});

type TeamMember = {
	id: number;
	name: string;
	email: string;
	loginId: string;
	role: string;
	status: "Enabled" | "Disabled";
};

const teamMembers: TeamMember[] = [
	{
		id: 1,
		name: "RAKESH KUMAR SHARMA",
		email: "deplopeerd@gmail.com",
		loginId: "CN33921",
		role: "AceX Contact Center Studio Ultra Webrtc",
		status: "Enabled",
	},
	{
		id: 2,
		name: "CRLA Zainab",
		email: "hr@hireorbit.agency",
		loginId: "zainab10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 3,
		name: "CRLA Tasneem",
		email: "hr@hireorbit.agency",
		loginId: "tasneem10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 4,
		name: "CRLA Madiha",
		email: "hr@hireorbit.agency",
		loginId: "madiha10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 5,
		name: "CRLM Shifa",
		email: "hr@hireorbit.agency",
		loginId: "shifa10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 6,
		name: "CRLD Aayushi",
		email: "hr@hireorbit.agency",
		loginId: "aayushi10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 7,
		name: "CRLA Dhriti",
		email: "hr@hireorbit.agency",
		loginId: "dhriti10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 8,
		name: "CRLA Vazira",
		email: "hr@hireorbit.agency",
		loginId: "vazira10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 9,
		name: "CRLB M Ayushi",
		email: "hr@hireorbit.agency",
		loginId: "ayushi10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 10,
		name: "CRLD Sanjib",
		email: "hr@hireorbit.agency",
		loginId: "sanjib10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 11,
		name: "CRLA Neha",
		email: "hr@hireorbit.agency",
		loginId: "neha10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 12,
		name: "CRLB Priya",
		email: "hr@hireorbit.agency",
		loginId: "priya10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 13,
		name: "CRLD Rahul",
		email: "hr@hireorbit.agency",
		loginId: "rahul10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 14,
		name: "CRLA Komal",
		email: "hr@hireorbit.agency",
		loginId: "komal10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 15,
		name: "CRLB Pooja",
		email: "hr@hireorbit.agency",
		loginId: "pooja10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 16,
		name: "CRLD Amit",
		email: "hr@hireorbit.agency",
		loginId: "amit10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 17,
		name: "CRLA Nisha",
		email: "hr@hireorbit.agency",
		loginId: "nisha10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 18,
		name: "CRLB Mohit",
		email: "hr@hireorbit.agency",
		loginId: "mohit10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 19,
		name: "CRLD Simran",
		email: "hr@hireorbit.agency",
		loginId: "simran10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 20,
		name: "CRLA Anjali",
		email: "hr@hireorbit.agency",
		loginId: "anjali10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 21,
		name: "CRLB Arjun",
		email: "hr@hireorbit.agency",
		loginId: "arjun10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 22,
		name: "CRLD Ritu",
		email: "hr@hireorbit.agency",
		loginId: "ritu10",
		role: "Dialer Role",
		status: "Enabled",
	},
	{
		id: 23,
		name: "CRLA Karan",
		email: "hr@hireorbit.agency",
		loginId: "karan10",
		role: "Dialer Role",
		status: "Enabled",
	},
];

function ShowMemberPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const filteredMembers = useMemo(() => {
		const value = search.trim().toLowerCase();

		if (!value) {
			return teamMembers;
		}

		return teamMembers.filter((member) =>
			`${member.name} ${member.email} ${member.loginId} ${member.role} ${member.status}`
				.toLowerCase()
				.includes(value)
		);
	}, [search]);

	const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
	const safePage = Math.min(currentPage, totalPages);
	const startIndex = (safePage - 1) * pageSize;
	const visibleMembers = filteredMembers.slice(
		startIndex,
		startIndex + pageSize
	);

	const firstEntry = filteredMembers.length === 0 ? 0 : startIndex + 1;
	const lastEntry = Math.min(startIndex + pageSize, filteredMembers.length);

	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	return (
		<div className="flex min-h-svh flex-col bg-[#f4f7fb] text-slate-700 dark:bg-[#07111f] dark:text-slate-100">
			<AdminTopbar />

			<main className="flex-1 p-4 md:p-6">
				<div className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-slate-200/50 shadow-sm dark:border-slate-800 dark:bg-[#0b1728] dark:shadow-none">
					{/* Header */}
					<div className="flex flex-col gap-3 border-slate-200 border-b bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-[#0b1728]">
						<h1 className="border-[#0757ff] border-l-4 pl-3 font-semibold text-[#102b55] text-base dark:text-slate-100">
							Team Members
						</h1>

						<div className="flex flex-wrap items-center gap-2">
							<Button
								className="h-9 rounded-lg border-slate-200 bg-white px-3 text-slate-600 text-xs shadow-sm hover:border-[#0757ff]/40 hover:bg-blue-50/50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
								size="sm"
								variant="outline"
							>
								Regenerate Password for All Members
							</Button>

							<Button
								className="h-9 rounded-lg border-slate-200 bg-white px-3 text-slate-600 text-xs shadow-sm hover:border-[#0757ff]/40 hover:bg-blue-50/50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
								onClick={() => navigate({ to: "/admin/member-groups" })}
								size="sm"
								variant="outline"
							>
								Team Member Groups
							</Button>

							<select
								aria-label="More Actions"
								className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-600 text-xs shadow-sm outline-none focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
								defaultValue=""
							>
								<option disabled value="">
									More Actions
								</option>
								<option value="export">Export Members</option>
								<option value="regenerate">Regenerate Passwords</option>
							</select>
						</div>
					</div>

					{/* Table controls */}
					<div className="flex flex-col gap-4 border-slate-100 border-b bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/30">
						<label className="flex items-center gap-2 text-slate-400 text-xs">
							Show
							<select
								aria-label="Entries per page"
								className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-700 outline-none focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
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

						<div className="flex items-center gap-2">
							<label className="sr-only" htmlFor="team-member-search">
								Search
							</label>
							<div className="relative w-full sm:w-64">
								<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
								<Input
									className="h-9 rounded-lg border-slate-200 bg-white pl-9 text-slate-700 text-xs shadow-sm focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500"
									id="team-member-search"
									onChange={(event) => {
										setSearch(event.target.value);
										setCurrentPage(1);
									}}
									placeholder="Search"
									value={search}
								/>
							</div>
						</div>
					</div>

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="w-full min-w-[1050px] border-collapse text-left text-xs">
							<thead className="border-slate-100 border-b bg-slate-50/70 text-[#263b5b] dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
								<tr>
									<th className="px-4 py-3 font-medium">S.No.</th>
									<th className="px-4 py-3 font-medium">Name</th>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Login ID</th>
									<th className="px-4 py-3 font-medium">Role</th>
									<th className="px-4 py-3 font-medium">Status</th>
									<th className="px-4 py-3 font-medium">Action</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
								{visibleMembers.map((member) => (
									<tr
										className="transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-900/50"
										key={member.id}
									>
										<td className="px-4 py-4 text-slate-500 dark:text-slate-400">
											{member.id}.
										</td>
										<td className="px-4 py-4 font-medium text-[#102b55] dark:text-slate-200">
											{member.name}
											{member.id === 1 && (
												<span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-[#0757ff] text-[10px] dark:bg-blue-950/60 dark:text-blue-400">
													Owner
												</span>
											)}
										</td>
										<td className="px-4 py-4 text-slate-600 dark:text-slate-400">
											{member.email}
										</td>
										<td className="px-4 py-4 text-slate-600 dark:text-slate-400">
											{member.loginId}
										</td>
										<td className="px-4 py-4 text-slate-600 dark:text-slate-400">
											{member.role}
										</td>
										<td className="px-4 py-4">
											<span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
												<span className="size-2 rounded-full bg-emerald-500" />
												{member.status}
											</span>
										</td>
										<td className="px-4 py-4">
											<select
												aria-label={`Actions for ${member.name}`}
												className="h-9 min-w-32 rounded-lg border border-slate-200 bg-white px-2.5 text-slate-600 text-xs shadow-sm outline-none transition hover:border-[#0757ff]/40 focus:border-[#0757ff] focus:ring-2 focus:ring-[#0757ff]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
												defaultValue=""
											>
												<option disabled value="">
													Select an Action
												</option>
												<option value="view">View</option>
												<option value="edit">Edit</option>
												<option value="delete">Delete</option>
											</select>
										</td>
									</tr>
								))}

								{visibleMembers.length === 0 && (
									<tr>
										<td
											className="px-4 py-12 text-center text-slate-400 dark:text-slate-500"
											colSpan={7}
										>
											No team members found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Footer / pagination */}
					<div className="flex flex-col gap-4 border-slate-100 border-t bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0b1728]">
						<span className="text-slate-500 text-xs">
							Showing {firstEntry} to {lastEntry} of {filteredMembers.length}{" "}
							entries
						</span>

						<div className="flex items-center gap-1">
							<Button
								aria-label="Previous page"
								className="h-8 rounded-lg border-slate-200 bg-white px-2 text-slate-500 text-xs shadow-none hover:border-[#0757ff]/40 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
								disabled={safePage === 1}
								onClick={() => goToPage(safePage - 1)}
								size="sm"
								variant="outline"
							>
								<ChevronLeft className="size-3.5" />
								Previous
							</Button>

							{Array.from({ length: totalPages }, (_, index) => index + 1)
								.slice(0, 5)
								.map((page) => (
									<Button
										className={
											page === safePage
												? "h-8 min-w-8 border-blue-600 bg-blue-600 px-2 text-white text-xs hover:bg-blue-600"
												: "h-8 min-w-8 border-0 border-slate-700 px-2 text-slate-400 text-xs hover:bg-slate-800"
										}
										key={page}
										onClick={() => goToPage(page)}
										size="sm"
										variant="outline"
									>
										{page}
									</Button>
								))}

							<Button
								aria-label="Next page"
								className="h-8 rounded-lg border-slate-200 bg-white px-2 text-slate-500 text-xs shadow-none hover:border-[#0757ff]/40 hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
								disabled={safePage === totalPages}
								onClick={() => goToPage(safePage + 1)}
								size="sm"
								variant="outline"
							>
								Next
								<ChevronRight className="size-3.5" />
							</Button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

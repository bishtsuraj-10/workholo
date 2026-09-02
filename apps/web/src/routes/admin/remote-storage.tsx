// biome-ignore-all lint/performance/noJsxPropsBind: Form controls use local component state.

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";

import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";

export const Route = createFileRoute("/admin/remote-storage")({
	component: RemoteStoragePage,
});

type RemoteStorageConfiguration = {
	id: number;
	name: string;
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	defaultOutputFormat: string;
	status: string;
};

const remoteStorageConfigurations: RemoteStorageConfiguration[] = [];

function RemoteStoragePage() {
	const [search, setSearch] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isAddConfigurationOpen, setIsAddConfigurationOpen] = useState(false);

	const [name, setName] = useState("");
	const [accessKeyId, setAccessKeyId] = useState("");
	const [secretAccessKey, setSecretAccessKey] = useState("");
	const [region, setRegion] = useState("ap-south-1");
	const [defaultOutputFormat, setDefaultOutputFormat] = useState("");
	const [customReports, setCustomReports] = useState(true);
	const [s3BucketPath, setS3BucketPath] = useState("");
	const [s3BucketPublicUrl, setS3BucketPublicUrl] = useState("");

	const openAddConfiguration = () => {
		setName("");
		setAccessKeyId("");
		setSecretAccessKey("");
		setRegion("ap-south-1");
		setDefaultOutputFormat("");
		setCustomReports(true);
		setS3BucketPath("");
		setS3BucketPublicUrl("");
		setIsAddConfigurationOpen(true);
	};

	const closeAddConfiguration = () => {
		setIsAddConfigurationOpen(false);
	};

	const filteredConfigurations = useMemo(() => {
		const value = search.trim().toLowerCase();

		if (!value) {
			return remoteStorageConfigurations;
		}

		return remoteStorageConfigurations.filter((item) =>
			`${item.id} ${item.name} ${item.accessKeyId} ${item.secretAccessKey} ${item.region} ${item.defaultOutputFormat} ${item.status}`
				.toLowerCase()
				.includes(value)
		);
	}, [search]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredConfigurations.length / pageSize)
	);

	const safePage = Math.min(currentPage, totalPages);

	const startIndex = (safePage - 1) * pageSize;

	const visibleConfigurations = filteredConfigurations.slice(
		startIndex,
		startIndex + pageSize
	);

	const firstShown = filteredConfigurations.length === 0 ? 0 : startIndex + 1;

	const lastShown = Math.min(
		startIndex + pageSize,
		filteredConfigurations.length
	);

	const goFirst = () => {
		setCurrentPage(1);
	};

	const goPrevious = () => {
		setCurrentPage((page) => Math.max(1, page - 1));
	};

	const goNext = () => {
		setCurrentPage((page) => Math.min(totalPages, page + 1));
	};

	const goLast = () => {
		setCurrentPage(totalPages);
	};

	return (
		<div className="flex min-h-svh flex-col bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />

			<main className="flex-1 p-4 md:p-6">
				<div className="mx-auto max-w-[1600px]">
					<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
						{/* PAGE HEADER */}
						<div className="flex flex-col gap-3 border-slate-200 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
							<div>
								<h1 className="font-bold text-[#102b55] text-base tracking-tight dark:text-slate-100">
									Remote Storage
								</h1>

								<p className="mt-0.5 text-slate-500 text-xs dark:text-slate-400">
									Manage AWS storage configurations for reports and recordings.
								</p>
							</div>

							<Button
								className="h-9 w-fit rounded-lg bg-[#0757ff] px-4 text-xs shadow-blue-500/20 shadow-sm hover:bg-[#004be0] dark:bg-blue-600 dark:hover:bg-blue-500"
								onClick={openAddConfiguration}
								type="button"
							>
								<Plus className="mr-1.5 size-3.5" />
								Add Configuration
							</Button>
						</div>

						{/* INFORMATION NOTE */}
						<div className="mx-5 mt-5 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3.5 text-slate-600 text-xs dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-slate-300">
							<div className="mb-2 flex items-center gap-2">
								<div className="flex size-5 items-center justify-center rounded-full bg-[#0757ff] font-bold text-[10px] text-white dark:bg-blue-600">
									i
								</div>

								<p className="font-semibold text-[#102b55] dark:text-slate-100">
									Please note
								</p>
							</div>

							<ol className="list-decimal space-y-1.5 pl-5 leading-relaxed">
								<li>
									Verified AWS Credentials are used to store call recordings and
									custom reports.
								</li>

								<li>
									Verification of credentials is performed through{" "}
									<code className="rounded bg-white px-1.5 py-0.5 font-mono text-[#0757ff] text-[10px] dark:bg-slate-900 dark:text-blue-400">
										aws s3 cp
									</code>{" "}
									command.
								</li>

								<li>
									Make sure ACLs are enabled on the bucket provided. You can
									confirm this on your S3 Console by{" "}
									<code className="rounded bg-white px-1.5 py-0.5 font-mono text-[#0757ff] text-[10px] dark:bg-slate-900 dark:text-blue-400">
										Bucket → Permissions → Object Ownership → Edit
									</code>
								</li>

								<li className="flex flex-wrap items-center gap-1.5">
									<span>
										Configuration used as default for call recording upload is
										marked by
									</span>

									<span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500 font-bold text-[10px] text-white shadow-sm">
										✓
									</span>
								</li>
							</ol>
						</div>

						{/* TABLE CONTROLS */}
						<div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
								<span>Show</span>

								<select
									aria-label="Rows per page"
									className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-slate-700 text-xs shadow-sm outline-none transition focus:border-[#0757ff] focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
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

								<span>entries</span>
							</div>

							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

								<Input
									className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs shadow-sm transition focus:border-[#0757ff] focus:ring-2 focus:ring-blue-500/10 sm:w-[240px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
									id="remote-storage-search"
									onChange={(event) => {
										setSearch(event.target.value);
										setCurrentPage(1);
									}}
									placeholder="Search configurations..."
									value={search}
								/>
							</div>
						</div>

						{/* TABLE */}
						<div className="overflow-x-auto px-5">
							<table className="w-full min-w-[1100px] border-collapse text-xs">
								<thead>
									<tr className="border-slate-100 border-y bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/70">
										<th className="w-[80px] px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											S.No.
										</th>

										<th className="px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Name
										</th>

										<th className="px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Access Key ID
										</th>

										<th className="px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Secret Access Key
										</th>

										<th className="px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Region
										</th>

										<th className="px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Default Output Format
										</th>

										<th className="px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Status
										</th>

										<th className="w-[140px] px-3 py-3 text-left font-semibold text-[#263b5b] dark:text-slate-300">
											Actions
										</th>
									</tr>
								</thead>

								<tbody>
									{visibleConfigurations.map((item) => (
										<tr
											className="border-slate-100 border-b transition-colors last:border-0 hover:bg-blue-50/30 dark:border-slate-800 dark:hover:bg-blue-950/20"
											key={item.id}
										>
											<td className="px-3 py-3.5 font-medium text-slate-400 dark:text-slate-500">
												{item.id}
											</td>

											<td className="px-3 py-3.5 font-medium text-slate-700 dark:text-slate-200">
												{item.name}
											</td>

											<td className="px-3 py-3.5 text-slate-600 dark:text-slate-300">
												{item.accessKeyId}
											</td>

											<td className="px-3 py-3.5 text-slate-600 dark:text-slate-300">
												{item.secretAccessKey}
											</td>

											<td className="px-3 py-3.5 text-slate-600 dark:text-slate-300">
												{item.region}
											</td>

											<td className="px-3 py-3.5 text-slate-600 dark:text-slate-300">
												{item.defaultOutputFormat}
											</td>

											<td className="px-3 py-3.5">
												<span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-[10px] text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
													{item.status}
												</span>
											</td>

											<td className="px-3 py-3.5">
												<button
													className="rounded-md px-2.5 py-1.5 font-medium text-[#0757ff] text-[11px] transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
													type="button"
												>
													Select an Action
												</button>
											</td>
										</tr>
									))}

									{visibleConfigurations.length === 0 && (
										<tr>
											<td className="px-4 py-14 text-center" colSpan={8}>
												<div className="flex flex-col items-center justify-center">
													<div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
														<Search className="size-5 text-slate-400 dark:text-slate-500" />
													</div>

													<p className="font-medium text-slate-500 text-xs dark:text-slate-400">
														No data available in table
													</p>

													<p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
														Add an AWS configuration to get started.
													</p>
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{/* FOOTER */}
						<div className="flex flex-col gap-3 border-slate-100 border-t px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
							<p className="text-slate-400 dark:text-slate-500">
								Showing{" "}
								<span className="font-semibold text-slate-600 dark:text-slate-300">
									{firstShown}
								</span>{" "}
								to{" "}
								<span className="font-semibold text-slate-600 dark:text-slate-300">
									{lastShown}
								</span>{" "}
								of{" "}
								<span className="font-semibold text-slate-600 dark:text-slate-300">
									{filteredConfigurations.length}
								</span>{" "}
								entries
							</p>

							<div className="flex items-center gap-1.5">
								<Button
									className="h-8 rounded-lg border-slate-200 px-3 text-[11px] text-slate-500 shadow-sm hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
									disabled={safePage === 1}
									onClick={goFirst}
									size="sm"
									type="button"
									variant="outline"
								>
									First
								</Button>

								<Button
									className="h-8 rounded-lg border-slate-200 px-3 text-[11px] text-slate-500 shadow-sm hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
									disabled={safePage === 1}
									onClick={goPrevious}
									size="sm"
									type="button"
									variant="outline"
								>
									<ChevronLeft className="mr-1 size-3.5" />
									Previous
								</Button>

								<span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#0757ff] px-2 font-medium text-white shadow-sm dark:bg-blue-600">
									{safePage}
								</span>

								<Button
									className="h-8 rounded-lg border-slate-200 px-3 text-[11px] text-slate-500 shadow-sm hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
									disabled={safePage === totalPages}
									onClick={goNext}
									size="sm"
									type="button"
									variant="outline"
								>
									Next
									<ChevronRight className="ml-1 size-3.5" />
								</Button>

								<Button
									className="h-8 rounded-lg border-slate-200 px-3 text-[11px] text-slate-500 shadow-sm hover:bg-blue-50 hover:text-[#0757ff] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
									disabled={safePage === totalPages}
									onClick={goLast}
									size="sm"
									type="button"
									variant="outline"
								>
									Last
								</Button>
							</div>
						</div>
					</section>
				</div>
			</main>

			{/* ADD AWS CONFIGURATION MODAL */}
			{isAddConfigurationOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
					<button
						aria-label="Close add AWS configuration dialog"
						className="absolute inset-0 cursor-default"
						onClick={closeAddConfiguration}
						type="button"
					/>

					<div
						aria-labelledby="add-aws-configuration-title"
						aria-modal="true"
						className="relative w-full max-w-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0b1728]"
						role="dialog"
					>
						{/* MODAL HEADER */}
						<div className="flex h-12 items-center justify-between bg-[#0757ff] px-5 dark:bg-blue-600">
							<div>
								<h2
									className="font-semibold text-sm text-white"
									id="add-aws-configuration-title"
								>
									Add AWS Configuration
								</h2>

								<p className="mt-0.5 text-[10px] text-blue-100">
									Configure remote AWS storage
								</p>
							</div>

							<button
								aria-label="Close"
								className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
								onClick={closeAddConfiguration}
								type="button"
							>
								<X className="size-4" />
							</button>
						</div>

						{/* MODAL BODY */}
						<div className="px-6 py-6">
							<div className="space-y-5">
								{/* NAME */}
								<ModalInput
									help
									id="aws-name"
									onChange={setName}
									placeholder="Name*"
									value={name}
								/>

								{/* ACCESS KEY */}
								<ModalInput
									help
									id="aws-access-key-id"
									onChange={setAccessKeyId}
									placeholder="Access Key ID*"
									value={accessKeyId}
								/>

								{/* SECRET KEY */}
								<ModalInput
									help
									id="aws-secret-access-key"
									onChange={setSecretAccessKey}
									placeholder="Secret Access Key*"
									type="password"
									value={secretAccessKey}
								/>

								{/* REGION + OUTPUT FORMAT */}
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="relative">
										<label
											className="mb-1.5 block font-medium text-[11px] text-slate-400 dark:text-slate-500"
											htmlFor="aws-region"
										>
											Region ID
										</label>

										<Input
											className="h-9 rounded-none border-0 border-slate-200 border-b bg-transparent px-0 pr-8 text-xs shadow-none focus:border-[#0757ff] focus-visible:ring-0 dark:border-slate-700 dark:text-slate-100"
											id="aws-region"
											onChange={(event) => setRegion(event.target.value)}
											value={region}
										/>

										<HelpIcon />
									</div>

									<div className="relative">
										<label
											className="mb-1.5 block font-medium text-[11px] text-slate-400 dark:text-slate-500"
											htmlFor="aws-output-format"
										>
											Default Output Format
										</label>

										<select
											className="h-9 w-full appearance-none border-0 border-slate-200 border-b bg-transparent pr-8 text-slate-700 text-xs outline-none transition focus:border-[#0757ff] dark:border-slate-700 dark:bg-transparent dark:text-slate-200"
											id="aws-output-format"
											onChange={(event) =>
												setDefaultOutputFormat(event.target.value)
											}
											value={defaultOutputFormat}
										>
											<option value="">Select an Option</option>
											<option value="CSV">CSV</option>
											<option value="XLSX">XLSX</option>
											<option value="JSON">JSON</option>
											<option value="PDF">PDF</option>
										</select>

										<span className="pointer-events-none absolute right-7 bottom-2 text-[9px] text-slate-400">
											▼
										</span>

										<HelpIcon />
									</div>
								</div>

								{/* CUSTOM REPORTS */}
								<div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-slate-600 text-xs dark:bg-slate-900/70 dark:text-slate-300">
									<span>Use this configuration for:</span>

									<button
										aria-label="Use this configuration for Custom Reports"
										aria-pressed={customReports}
										className={`inline-flex size-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
											customReports
												? "border-emerald-500 bg-emerald-500 text-white"
												: "border-slate-300 bg-white text-transparent dark:border-slate-600 dark:bg-slate-800"
										}`}
										onClick={() => setCustomReports((checked) => !checked)}
										type="button"
									>
										✓
									</button>

									<span>Custom Reports</span>
								</div>

								{/* S3 PATH */}
								<ModalInput
									help
									id="s3-bucket-path"
									onChange={setS3BucketPath}
									placeholder="S3 Bucket Path for Custom Reports"
									value={s3BucketPath}
								/>

								{/* S3 PUBLIC URL */}
								<ModalInput
									help
									id="s3-bucket-public-url"
									onChange={setS3BucketPublicUrl}
									placeholder="S3 Bucket Public URL for Custom Reports"
									value={s3BucketPublicUrl}
								/>
							</div>

							{/* MODAL ACTIONS */}
							<div className="mt-7 flex justify-end gap-2">
								<Button
									className="h-9 rounded-lg bg-[#0757ff] px-5 text-xs shadow-blue-500/20 shadow-sm hover:bg-[#004be0] dark:bg-blue-600 dark:hover:bg-blue-500"
									onClick={closeAddConfiguration}
									type="button"
								>
									SAVE
								</Button>

								<Button
									className="h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-600 text-xs shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
									onClick={closeAddConfiguration}
									type="button"
									variant="outline"
								>
									CLOSE
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

function HelpIcon() {
	return (
		<span className="pointer-events-none absolute right-1 bottom-2 flex size-4 items-center justify-center rounded-full border border-cyan-400 font-semibold text-[9px] text-cyan-500">
			?
		</span>
	);
}

function ModalInput({
	id,
	placeholder,
	value,
	onChange,
	type = "text",
	help = false,
}: {
	id: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	help?: boolean;
}) {
	return (
		<div className="relative">
			<Input
				className="h-9 rounded-none border-0 border-slate-200 border-b bg-transparent px-0 pr-8 text-xs shadow-none placeholder:text-slate-400 focus:border-[#0757ff] focus-visible:ring-0 dark:border-slate-700 dark:bg-transparent dark:text-slate-100 dark:placeholder:text-slate-500"
				id={id}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				type={type}
				value={value}
			/>

			{help ? <HelpIcon /> : null}
		</div>
	);
}

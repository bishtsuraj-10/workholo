// biome-ignore-all lint/performance/noJsxPropsBind: Form controls use local component state.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CircleHelp } from "lucide-react";
import { useState } from "react";

import { AdminTopbar } from "@/components/admin/admin-topbar";

export const Route = createFileRoute("/admin/add-sftp")({
	component: AddSftpConfigurationPage,
});

function AddSftpConfigurationPage() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [serviceType, setServiceType] = useState("Reports");
	const [host, setHost] = useState("");
	const [port, setPort] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [privateKey, setPrivateKey] = useState<File | null>(null);
	const [passphrase, setPassphrase] = useState("");
	const [targetFolderPath, setTargetFolderPath] = useState("");

	const save = () => {
		// UI-only for now. Backend/API integration can be added later.
		console.log({
			name,
			serviceType,
			host,
			port,
			username,
			password,
			privateKey: privateKey?.name ?? "",
			passphrase,
			targetFolderPath,
		});
	};

	return (
		<div className="min-h-svh bg-[#eef3f9] dark:bg-[#07111f]">
			<AdminTopbar />

			<main className="p-4 md:p-6">
				<div className="mx-auto max-w-7xl">
					{/* PAGE HEADER */}
					<div className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
						<div className="flex items-center gap-2">
							<h1 className="font-bold text-[#102b55] text-xl tracking-tight dark:text-white">
								Add SFTP Configuration
							</h1>
						</div>

						<p className="mt-1 text-slate-500 text-xs dark:text-slate-400">
							Configure an SFTP connection for secure file transfer.
						</p>
					</div>

					{/* MAIN CARD */}
					<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0b1728]">
						{/* CARD HEADER */}
						<div className="border-slate-100 border-b px-5 py-4 dark:border-slate-800">
							<h2 className="font-semibold text-[#263b5b] text-sm dark:text-slate-200">
								SFTP Configuration
							</h2>

							<p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
								Enter the connection details below.
							</p>
						</div>

						{/* FORM */}
						<div className="p-5 md:p-8">
							<div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
								<FormField
									help
									label="Name"
									onChange={setName}
									required
									value={name}
								/>

								<div>
									<div className="mb-2 flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
										<span>Select Service Type</span>

										<CircleHelp className="size-3.5 text-slate-400 dark:text-slate-500" />
									</div>

									<select
										className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-700 text-xs outline-none transition focus:border-[#0757ff] focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-blue-500"
										onChange={(event) => setServiceType(event.target.value)}
										value={serviceType}
									>
										<option value="Reports">Reports</option>
										<option value="CDR">CDR</option>
										<option value="Call Recording">Call Recording</option>
									</select>
								</div>

								<FormField
									help
									label="Host"
									onChange={setHost}
									required
									value={host}
								/>

								<FormField
									help
									label="Port"
									onChange={setPort}
									required
									type="number"
									value={port}
								/>

								<FormField
									help
									label="Username"
									onChange={setUsername}
									required
									value={username}
								/>

								<FormField
									label="Password"
									onChange={setPassword}
									type="password"
									value={password}
								/>

								{/* PRIVATE KEY */}
								<div>
									<div className="mb-2 flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
										<span>Private Key</span>

										<CircleHelp className="size-3.5 text-slate-400 dark:text-slate-500" />
									</div>

									<div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white px-2 transition focus-within:border-[#0757ff] focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900">
										<input
											className="w-full text-[11px] text-slate-600 outline-none file:mr-2 file:rounded-md file:border file:border-slate-200 file:bg-slate-50 file:px-2.5 file:py-1 file:font-medium file:text-[10px] file:text-slate-600 hover:file:bg-slate-100 dark:text-slate-300 dark:file:border-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700"
											onChange={(event) =>
												setPrivateKey(event.target.files?.[0] ?? null)
											}
											type="file"
										/>
									</div>
								</div>

								<FormField
									label="Key Passphrase"
									onChange={setPassphrase}
									placeholder="Enter passphrase"
									value={passphrase}
								/>

								<FormField
									help
									label="Target Folder Path"
									onChange={setTargetFolderPath}
									required
									value={targetFolderPath}
								/>
							</div>

							{/* ACTIONS */}
							<div className="mt-9 flex items-center gap-2 border-slate-100 border-t pt-6 dark:border-slate-800">
								<button
									className="h-9 rounded-lg bg-[#0757ff] px-5 font-medium text-white text-xs shadow-blue-500/20 shadow-sm transition hover:bg-[#004be0] dark:bg-blue-600 dark:hover:bg-blue-500"
									onClick={save}
									type="button"
								>
									SAVE
								</button>

								<button
									className="h-9 rounded-lg border border-slate-200 bg-white px-5 font-medium text-slate-600 text-xs transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
									onClick={() =>
										navigate({
											to: "/admin/sftp",
										})
									}
									type="button"
								>
									CANCEL
								</button>
							</div>
						</div>
					</section>

					{/* SECURITY FOOTER */}
					<div className="mt-3 flex items-center justify-center pb-2 text-[10px] text-slate-400 dark:text-slate-500">
						SFTP connections are securely managed
					</div>
				</div>
			</main>
		</div>
	);
}

function FormField({
	label,
	required,
	help,
	value,
	onChange,
	type = "text",
	placeholder,
}: {
	label: string;
	required?: boolean;
	help?: boolean;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
}) {
	return (
		<div>
			<div className="mb-2 flex items-center gap-2 text-slate-500 text-xs dark:text-slate-400">
				<span>
					{label}
					{required ? <span className="ml-0.5 text-red-500">*</span> : null}
				</span>

				{help ? (
					<CircleHelp className="size-3.5 text-slate-400 dark:text-slate-500" />
				) : null}
			</div>

			<input
				className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-700 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#0757ff] focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:placeholder:text-slate-500"
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				type={type}
				value={value}
			/>
		</div>
	);
}

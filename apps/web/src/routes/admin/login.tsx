// biome-ignore-all lint/performance/noJsxPropsBind: Authentication controls use local component state.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workholo/ui/components/button";
import { Input } from "@workholo/ui/components/input";
import { Label } from "@workholo/ui/components/label";
import {
	BarChart3,
	Eye,
	EyeOff,
	LockKeyhole,
	Phone,
	ShieldCheck,
	UserRound,
	UsersRound,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/login")({
	component: AdminLoginPage,
});

function AdminLoginPage() {
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [loginId, setLoginId] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleLogin() {
		if (!(loginId.trim() && password.trim())) {
			return;
		}

		setIsSubmitting(true);
		const { error } = await authClient.signIn.email({
			email: loginId.trim(),
			password,
		});
		setIsSubmitting(false);

		if (error) {
			toast.error(error.message ?? "Unable to sign in.");
			return;
		}

		navigate({ to: "/admin" });
	}

	return (
		<div className="min-h-svh bg-[#eef3f9] lg:p-4">
			<div className="grid min-h-svh overflow-hidden bg-white lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[1.1fr_0.9fr] lg:rounded-2xl lg:shadow-[0_20px_60px_rgba(15,47,95,0.12)]">
				{/* =========================================================
				    LEFT — CALLING CRM
				========================================================= */}
				<div className="relative hidden h-full min-h-0 overflow-hidden bg-[#061f4d] lg:flex">
					{/* Background */}
					<div className="absolute inset-0 overflow-hidden">
						{/* Blue glow */}
						<div className="absolute top-[25%] right-[-15%] size-[34rem] rounded-full bg-[#0757ff]/25 blur-3xl" />

						<div className="absolute right-[-15%] bottom-[-25%] size-[32rem] rounded-full bg-[#008cff]/15 blur-3xl" />

						{/* Diagonal shape */}
						<div className="absolute top-[-10%] right-[-15%] h-[125%] w-[55%] rotate-[18deg] bg-gradient-to-b from-[#0757ff]/15 via-[#0757ff]/5 to-transparent" />

						{/* Grid */}
						<div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />

						{/* Dots */}
						<div className="absolute top-8 right-8 h-36 w-48 opacity-30 [background-image:radial-gradient(#3d8cff_1px,transparent_1px)] [background-size:8px_8px]" />
					</div>

					<div className="relative z-10 flex h-full w-full flex-col p-8 xl:p-10">
						{/* =====================================================
						    LOGO
						===================================================== */}
						<div className="flex items-center gap-3">
							<div className="flex size-11 items-center justify-center rounded-xl bg-white shadow-lg">
								<span className="font-bold text-[#0757ff] text-xl">W</span>
							</div>

							<div>
								<p className="font-bold text-lg text-white tracking-tight">
									WORKHOLO
								</p>
							</div>
						</div>

						{/* =====================================================
						    MAIN AREA
						    CONTENT LEFT / DESIGN RIGHT
						===================================================== */}
						<div className="grid min-h-0 flex-1 grid-cols-[0.95fr_1.05fr] items-center gap-2">
							{/* =================================================
							    LEFT CONTENT
							================================================= */}
							<div className="relative z-20 max-w-[350px]">
								{/* Badge */}
								<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[10px] text-blue-200">
									<span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
									Admin Control Center
								</div>

								{/* Heading */}
								<h1 className="font-bold text-4xl text-white leading-[1.08] tracking-tight xl:text-[46px]">
									Manage your
									<span className="block text-[#1680ff]">
										calling operations.
									</span>
								</h1>

								<p className="mt-4 max-w-[330px] text-blue-100/65 text-sm leading-6">
									Monitor calls, manage agents, and grow your business from one
									powerful platform.
								</p>

								{/* Features */}
								<div className="mt-6 space-y-3.5">
									{/* Feature 1 */}
									<div className="flex items-center gap-3">
										<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0757ff]/25 text-blue-300">
											<Phone className="size-4" />
										</div>

										<div>
											<p className="font-semibold text-[11px] text-white">
												Real-time Call Monitoring
											</p>

											<p className="mt-0.5 text-[9px] text-blue-100/45">
												Track all calls in real-time
											</p>
										</div>
									</div>

									{/* Feature 2 */}
									<div className="flex items-center gap-3">
										<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0757ff]/25 text-blue-300">
											<UsersRound className="size-4" />
										</div>

										<div>
											<p className="font-semibold text-[11px] text-white">
												Agent Management
											</p>

											<p className="mt-0.5 text-[9px] text-blue-100/45">
												Manage agents and teams
											</p>
										</div>
									</div>

									{/* Feature 3 */}
									<div className="flex items-center gap-3">
										<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
											<ShieldCheck className="size-4" />
										</div>

										<div>
											<p className="font-semibold text-[11px] text-white">
												Secure & Reliable
											</p>

											<p className="mt-0.5 text-[9px] text-blue-100/45">
												Enterprise-grade security
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* =================================================
							    RIGHT DESIGN
							================================================= */}
							<div className="relative flex h-full min-h-0 items-center justify-center">
								<div className="relative size-[285px] xl:size-[330px]">
									{/* Outer rings */}
									<div className="absolute inset-0 rounded-full border border-blue-400/15" />

									<div className="absolute inset-8 rounded-full border border-blue-400/15" />

									<div className="absolute inset-16 rounded-full border border-blue-400/15" />

									{/* Glow */}
									<div className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0757ff]/25 blur-2xl" />

									{/* Orbit dots */}
									<div className="absolute top-[20%] left-[4%] size-2 rounded-full bg-blue-300 shadow-[0_0_10px_#60a5fa]" />

									<div className="absolute right-[5%] bottom-[22%] size-2 rounded-full bg-blue-300 shadow-[0_0_10px_#60a5fa]" />

									<div className="absolute top-[42%] right-[-2%] size-1.5 rounded-full bg-cyan-300" />

									{/* Main phone */}
									<div className="absolute top-1/2 left-1/2 flex size-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-300/30 bg-gradient-to-br from-[#1467ff] to-[#003fc7] shadow-[0_0_50px_rgba(0,91,255,0.45)]">
										<div className="flex size-20 items-center justify-center rounded-full bg-white/10">
											<Phone className="size-10 text-white" strokeWidth={1.7} />
										</div>

										{/* Online */}
										<div className="absolute right-1 bottom-5 flex size-5 items-center justify-center rounded-full border-[#061f4d] border-[3px] bg-emerald-400">
											<div className="size-1.5 rounded-full bg-white" />
										</div>
									</div>

									{/* Agents card */}
									<div className="absolute top-[12%] right-[-8px] flex items-center gap-2 rounded-xl border border-blue-300/20 bg-[#0b3978]/90 px-3 py-2.5 shadow-xl backdrop-blur-md">
										<div className="flex size-8 items-center justify-center rounded-lg bg-[#0757ff]">
											<UsersRound className="size-4 text-white" />
										</div>

										<div>
											<p className="text-[9px] text-blue-100/55">Agents</p>

											<p className="font-semibold text-[11px] text-white">
												Manage
											</p>
										</div>
									</div>

									{/* Analytics card */}
									<div className="absolute bottom-[14%] left-[-8px] flex items-center gap-2 rounded-xl border border-blue-300/20 bg-[#0b3978]/90 px-3 py-2.5 shadow-xl backdrop-blur-md">
										<div className="flex size-8 items-center justify-center rounded-lg bg-[#0757ff]">
											<BarChart3 className="size-4 text-white" />
										</div>

										<div>
											<p className="text-[9px] text-blue-100/55">Analytics</p>

											<p className="font-semibold text-[11px] text-white">
												Real-time
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="text-[10px] text-blue-100/35">
							© 2026 WORKHOLO. All rights reserved.
						</div>
					</div>
				</div>

				{/* =========================================================
				    RIGHT — LOGIN
				========================================================= */}
				<div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#f7faff] px-5 py-8 sm:px-10 lg:min-h-0">
					{/* Background decoration */}
					<div className="pointer-events-none absolute inset-0 overflow-hidden">
						<div className="absolute -top-32 -right-32 size-80 rounded-full bg-blue-100/50 blur-3xl" />

						<div className="absolute -bottom-32 -left-32 size-80 rounded-full bg-indigo-100/40 blur-3xl" />
					</div>

					<div className="relative z-10 w-full max-w-[400px]">
						{/* Mobile logo */}
						<div className="mb-8 flex items-center gap-3 lg:hidden">
							<div className="flex size-11 items-center justify-center rounded-xl bg-[#0757ff] text-white shadow-lg">
								<span className="font-bold text-xl">W</span>
							</div>

							<div>
								<p className="font-bold text-lg text-slate-900">WORKHOLO</p>

								<p className="text-slate-500 text-xs">Calling CRM Platform</p>
							</div>
						</div>

						{/* Login Card */}
						<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,47,95,0.08)] sm:p-8">
							{/* Heading */}
							<div className="mb-7">
								<div className="mb-3 flex items-center gap-2">
									<div className="size-1.5 rounded-full bg-[#0757ff]" />

									<p className="font-semibold text-[#0757ff] text-[10px] uppercase tracking-[0.14em]">
										Admin Portal
									</p>
								</div>

								<h2 className="font-bold text-2xl text-[#102b55] tracking-tight sm:text-3xl">
									Welcome Back
								</h2>

								<p className="mt-2 text-slate-500 text-xs leading-5 sm:text-sm">
									Sign in to access your admin dashboard.
								</p>
							</div>

							{/* Form */}
							<div className="space-y-5">
								{/* Login ID */}
								<div className="space-y-2">
									<Label
										className="font-semibold text-[#263b5b] text-xs"
										htmlFor="login-id"
									>
										Login ID
									</Label>

									<div className="group relative">
										<UserRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0757ff]" />

										<Input
											className="h-12 rounded-lg border-slate-200 bg-white pl-10 text-xs shadow-none transition-all placeholder:text-slate-400 focus-visible:border-[#0757ff] focus-visible:ring-4 focus-visible:ring-blue-500/10"
											id="login-id"
											onChange={(event) => setLoginId(event.target.value)}
											placeholder="Enter your login ID"
											value={loginId}
										/>
									</div>
								</div>

								{/* Password */}
								<div className="space-y-2">
									<Label
										className="font-semibold text-dark text-xs dark:text-[#263b5b]"
										htmlFor="password"
									>
										Password
									</Label>

									<div className="group relative">
										<LockKeyhole className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0757ff]" />

										<Input
											className="h-12 rounded-lg border-slate-200 bg-white pr-11 pl-10 text-xs shadow-none transition-all placeholder:text-slate-400 focus-visible:border-[#0757ff] focus-visible:ring-4 focus-visible:ring-blue-500/10"
											id="password"
											onChange={(event) => setPassword(event.target.value)}
											placeholder="Enter your password"
											type={showPassword ? "text" : "password"}
											value={password}
										/>

										<button
											aria-label={
												showPassword ? "Hide password" : "Show password"
											}
											className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
											onClick={() => setShowPassword((visible) => !visible)}
											type="button"
										>
											{showPassword ? (
												<EyeOff className="size-4" />
											) : (
												<Eye className="size-4" />
											)}
										</button>
									</div>
								</div>

								{/* Remember / Forgot */}
								<div className="flex items-center justify-between gap-4">
									<label className="flex cursor-pointer items-center gap-2 text-slate-500 text-xs">
										<input
											className="size-3.5 cursor-pointer accent-[#0757ff]"
											type="checkbox"
										/>

										<span>Remember me</span>
									</label>

									<button
										className="font-medium text-[#0757ff] text-xs transition-colors hover:text-blue-700 hover:underline"
										type="button"
									>
										Forgot password?
									</button>
								</div>

								{/* Login */}
								<Button
									className="h-12 w-full rounded-lg bg-[#0757ff] font-semibold text-xs shadow-blue-500/20 shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#004be0] hover:shadow-blue-500/25 hover:shadow-lg active:translate-y-0"
									disabled={isSubmitting}
									onClick={handleLogin}
									type="button"
								>
									{isSubmitting ? "Signing in..." : "Login to Dashboard"}
								</Button>
							</div>

							{/* Security */}
							<div className="mt-6 flex items-center justify-center gap-2 border-slate-100 border-t pt-5 text-[10px] text-slate-400">
								<ShieldCheck className="size-3.5 text-emerald-500" />

								<span>Secure admin access</span>
							</div>
						</div>

						{/* Bottom text */}
						<p className="mt-4 text-center text-[10px] text-slate-400">
							Authorized personnel only
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

// biome-ignore-all lint/performance/noJsxPropsBind: The action uses the route-local navigator.

import { useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	CheckCircle2,
	Eye,
	EyeOff,
	Headphones,
	LockKeyhole,
	Mail,
	PhoneCall,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import { useState } from "react";

export function AgentLogin() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Please enter your email address.");
			return;
		}

		if (!password.trim()) {
			setError("Please enter your password.");
			return;
		}

		setLoading(true);

		try {
			/*
			 * API LOGIN YAHAN CONNECT KARNA HAI.
			 *
			 * Example:
			 *
			 * const response = await loginAgent({
			 *   email,
			 *   password,
			 * });
			 *
			 * localStorage.setItem("agentToken", response.token);
			 */

			await new Promise((resolve) => setTimeout(resolve, 700));

			if (rememberMe) {
				localStorage.setItem("agentEmail", email);
			}

			await navigate({
				to: "/agent",
			});
		} catch {
			setError("Unable to sign in. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 p-1 text-slate-900">
			<div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
				{/* =====================================================
				    LEFT BRAND PANEL
				===================================================== */}
				<section className="relative hidden overflow-hidden bg-[#0757ff] lg:flex">
					{/* Background decoration */}
					<div className="absolute -top-32 -right-32 size-[420px] rounded-full border border-white/10" />
					<div className="absolute top-20 -right-20 size-[280px] rounded-full border border-white/10" />
					<div className="absolute -bottom-40 -left-32 size-[520px] rounded-full bg-blue-500/30 blur-3xl" />

					{/* Grid pattern */}
					<div
						className="absolute inset-0 opacity-[0.08]"
						style={{
							backgroundImage:
								"linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
							backgroundSize: "40px 40px",
						}}
					/>

					<div className="!px-14 !py-10 xl:!px-16 xl:!py-12 relative z-10 flex w-full flex-col justify-between">
						{/* BRAND */}
						<div className="flex items-center gap-3">
							<div className="flex size-11 items-center justify-center rounded-xl bg-white font-bold text-[#0757ff] text-xl shadow-lg">
								W
							</div>

							<div>
								<p className="font-bold text-lg text-white leading-none">
									Workholo
								</p>

								<p className="mt-1 text-[10px] text-blue-100 uppercase tracking-[0.18em]">
									Agent Panel
								</p>
							</div>
						</div>

						{/* HERO */}
						<div className="w-full max-w-xl pt-2">
							<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
								<span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

								<span className="font-medium text-white text-xs">
									Agent workspace
								</span>
							</div>

							<h1 className="font-bold text-5xl text-white leading-[1.08] tracking-tight xl:text-6xl">
								Manage your calls.
								<br />
								<span className="text-blue-200">Connect with leads.</span>
							</h1>

							<p className="mt-6 max-w-lg text-blue-100 text-sm leading-6 xl:text-base">
								Access your agent workspace, manage calls, follow up with leads
								and keep track of your daily performance from one simple
								dashboard.
							</p>

							{/* FEATURES */}
							<div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
								<FeatureCard
									description="Manage calls easily"
									icon={Headphones}
									title="Smart Dialer"
								/>

								<FeatureCard
									description="Protected workspace"
									icon={ShieldCheck}
									title="Secure Access"
								/>

								<FeatureCard
									description="Handle calls efficiently"
									icon={PhoneCall}
									title="Call Management"
								/>

								<FeatureCard
									description="Never miss a follow-up"
									icon={CheckCircle2}
									title="Lead Tracking"
								/>
							</div>
						</div>

						{/* FOOTER */}
						<div className="flex items-center justify-between pt-5 pb-2 text-blue-100 text-xs">
							<span>© {new Date().getFullYear()} Workholo</span>

							<span className="flex items-center gap-1.5">
								<ShieldCheck className="size-3.5" />
								Secure Agent Workspace
							</span>
						</div>
					</div>
				</section>

				{/* =====================================================
				    RIGHT LOGIN PANEL
				===================================================== */}
				<section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
					<div className="w-full max-w-[440px]">
						{/* MOBILE BRAND */}
						<div className="mb-7 flex items-center gap-3 lg:hidden">
							<div className="flex size-10 items-center justify-center rounded-xl bg-[#0757ff] font-bold text-lg text-white shadow-sm">
								W
							</div>

							<div>
								<p className="font-bold text-[#102b55]">Workholo</p>

								<p className="text-[9px] text-slate-400 uppercase tracking-wider">
									Agent Panel
								</p>
							</div>
						</div>

						{/* LOGIN CARD */}
						<div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.28)] sm:p-7">
							{/* ICON */}
							<div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#0757ff]">
								<UserRound className="size-5" strokeWidth={1.8} />
							</div>

							{/* HEADING */}
							<div>
								<h2 className="font-bold text-[#102b55] text-[28px] leading-tight tracking-tight">
									Welcome back
								</h2>

								<p className="mt-2 text-slate-500 text-sm">
									Sign in to your agent workspace
								</p>
							</div>

							{/* FORM */}
							<form className="mt-7 space-y-5" onSubmit={handleSubmit}>
								{/* EMAIL */}
								<div className="w-full">
									<label
										className="mb-2 block font-medium text-slate-700 text-xs"
										htmlFor="agent-email"
									>
										Email Address
									</label>

									<div className="relative w-full">
										<Mail
											className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400"
											strokeWidth={1.8}
										/>

										<input
											autoComplete="email"
											className="!h-12 !w-full !rounded-lg !border !border-slate-200 !bg-slate-50 !pl-11 !pr-4 hover:!border-slate-300 focus:!border-[#0757ff] focus:!bg-white box-border text-slate-800 text-sm outline-none transition-all duration-150 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10"
											id="agent-email"
											onChange={(event) => setEmail(event.target.value)}
											placeholder="Enter your email"
											type="email"
											value={email}
										/>
									</div>
								</div>

								{/* PASSWORD */}
								<div>
									<div className="mb-2 flex items-center justify-between">
										<label
											className="font-medium text-slate-700 text-xs"
											htmlFor="agent-password"
										>
											Password
										</label>

										<button
											className="font-medium text-[#0757ff] text-xs transition hover:text-[#004be0] hover:underline"
											onClick={() => {
												// Forgot password functionality
											}}
											type="button"
										>
											Forgot password?
										</button>
									</div>

									<div className="relative w-full">
										<LockKeyhole
											className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400"
											strokeWidth={1.8}
										/>

										<input
											autoComplete="current-password"
											className="!h-12 !w-full !rounded-lg !border !border-slate-200 !bg-slate-50 !pl-11 !pr-12 hover:!border-slate-300 focus:!border-[#0757ff] focus:!bg-white box-border text-slate-800 text-sm outline-none transition-all duration-150 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10"
											id="agent-password"
											onChange={(event) => setPassword(event.target.value)}
											placeholder="Enter your password"
											type={showPassword ? "text" : "password"}
											value={password}
										/>

										<button
											aria-label={
												showPassword ? "Hide password" : "Show password"
											}
											className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
											onClick={() => setShowPassword((value) => !value)}
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

								{/* OPTIONS */}
								<div className="flex items-center justify-between">
									<label className="flex cursor-pointer items-center gap-2">
										<input
											checked={rememberMe}
											className="size-4 rounded border-slate-300 accent-[#0757ff]"
											onChange={(event) => setRememberMe(event.target.checked)}
											type="checkbox"
										/>

										<span className="text-slate-500 text-xs">Remember me</span>
									</label>

									<div className="flex items-center gap-1.5 text-emerald-600 text-xs">
										<span className="size-1.5 rounded-full bg-emerald-500" />
										Secure login
									</div>
								</div>

								{/* ERROR */}
								{error ? (
									<div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-red-600 text-xs">
										{error}
									</div>
								) : null}

								{/* LOGIN BUTTON */}
								<button
									className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0757ff] font-semibold text-sm text-white shadow-blue-500/20 shadow-md transition-all duration-150 hover:bg-[#004be0] hover:shadow-blue-500/25 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
									disabled={loading}
									type="submit"
								>
									{loading ? (
										<>
											<span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
											Signing in...
										</>
									) : (
										<>
											Sign in
											<ArrowRight className="size-4" />
										</>
									)}
								</button>
							</form>

							{/* SECURITY BOX */}
							<div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
								<div className="flex items-center gap-3">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
										<ShieldCheck className="size-4" />
									</div>

									<div className="min-w-0">
										<p className="font-medium text-slate-700 text-xs">
											Your account is protected
										</p>

										<p className="mt-1 text-[10px] text-slate-400 leading-4">
											Only authorized agents can access the dialer workspace.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* HELP */}
						<p className="mt-5 text-center text-slate-400 text-xs">
							Need help?{" "}
							<button
								className="font-medium text-[#0757ff] hover:underline"
								type="button"
							>
								Contact your administrator
							</button>
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}

function FeatureCard({
	icon: Icon,
	title,
	description,
}: {
	icon: typeof Headphones;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition-all duration-150 hover:border-white/25 hover:bg-white/15">
			<div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white">
				<Icon className="size-4" strokeWidth={1.8} />
			</div>

			<p className="font-semibold text-sm text-white">{title}</p>

			<p className="mt-1 text-blue-100 text-xs">{description}</p>
		</div>
	);
}

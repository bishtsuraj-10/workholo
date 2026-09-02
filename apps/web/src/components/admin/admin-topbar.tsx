import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workholo/ui/components/avatar";
import { Button } from "@workholo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workholo/ui/components/dropdown-menu";
import { Separator } from "@workholo/ui/components/separator";
import { SidebarTrigger } from "@workholo/ui/components/sidebar";
import {
	Bell,
	CheckCheck,
	CircleAlert,
	LogOut,
	Mail,
	Moon,
	Phone,
	Settings,
	Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { authClient } from "@/lib/auth-client";

export function AdminTopbar() {
	const navigate = useNavigate();
	const { theme, setTheme } = useTheme();
	const { data: session } = authClient.useSession();
	const userName = session?.user.name?.trim() || "Admin";
	const userEmail = session?.user.email || "Signed-in administrator";
	const userPhone = "No phone number";
	const userInitial = userName.charAt(0).toUpperCase();

	const toggleTheme = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [setTheme, theme]);

	const signOut = useCallback(async () => {
		await authClient.signOut();
		navigate({ to: "/auth" });
	}, [navigate]);

	const openNotificationManagement = useCallback(() => {
		navigate({ to: "/admin/notification-management" });
	}, [navigate]);

	const openProfile = useCallback(() => {
		navigate({ to: "/admin/profile" });
	}, [navigate]);

	// const signOut = async () => {
	// 	await authClient.signOut();
	// 	navigate({ to: "/auth" });
	// };

	return (
		<header
			className="sticky top-0 flex h-16 shrink-0 items-center gap-3 border-slate-200 border-b bg-white px-4 dark:border-slate-800 dark:bg-slate-950"
			data-admin-topbar
		>
			<SidebarTrigger className="text-slate-600 hover:bg-slate-100 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400" />

			<Separator
				className="h-16 bg-slate-200 dark:bg-slate-800"
				orientation="vertical"
			/>

			<div className="flex flex-1 items-center">
				<div>
					<h1 className="font-semibold text-[#102b55] text-lg dark:text-white">
						Admin Dashboard
					</h1>
				</div>
			</div>

			{/* Theme Toggle */}
			<Button
				className="text-slate-500 hover:bg-blue-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
				onClick={toggleTheme}
				size="icon"
				title="Toggle theme"
				variant="ghost"
			>
				{theme === "dark" ? (
					<Sun className="size-4" />
				) : (
					<Moon className="size-4" />
				)}
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger aria-label="Open notifications">
					<Button
						className="relative text-slate-500 hover:bg-blue-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
						size="icon"
						title="Notifications"
						variant="ghost"
					>
						<Bell className="size-4" />
						<span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#0757ff] ring-2 ring-white dark:ring-slate-950" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-80 p-0">
					<div className="flex items-center justify-between border-slate-200 border-b px-4 py-3 dark:border-slate-700">
						<div>
							<p className="font-semibold text-foreground text-sm">
								Notifications
							</p>
							<p className="text-muted-foreground text-xs">Recent activity</p>
						</div>
						<CheckCheck className="size-4 text-[#0757ff]" />
					</div>

					<div className="p-2">
						<DropdownMenuItem className="items-start gap-3 py-3">
							<div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400">
								<Bell className="size-3.5" />
							</div>
							<div className="min-w-0">
								<p className="font-medium text-sm">Notifications are ready</p>
								<p className="mt-0.5 text-muted-foreground text-xs">
									Manage alerts and delivery preferences.
								</p>
							</div>
						</DropdownMenuItem>
					</div>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						className="m-2 justify-center font-medium text-[#0757ff]"
						onClick={openNotificationManagement}
					>
						<CircleAlert className="size-4" />
						Manage notifications
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<DropdownMenu>
				<DropdownMenuTrigger aria-label="Open user menu">
					<Avatar className="size-8 cursor-pointer border border-slate-200 dark:border-slate-700">
						<AvatarFallback className="bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950 dark:text-blue-400">
							{userInitial}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-72 p-0">
					<div className="flex items-center gap-3 border-slate-200 border-b px-4 py-4 dark:border-slate-700">
						<Avatar className="size-16 shrink-0">
							<AvatarFallback className="bg-[#0757ff] font-medium text-2xl text-white">
								{userInitial}
							</AvatarFallback>
						</Avatar>

						<div className="min-w-0">
							<p className="truncate font-medium text-foreground text-lg">
								{userName}
							</p>
							<p className="mt-0.5 truncate text-muted-foreground text-sm">
								{userEmail}
							</p>
							<p className="mt-1 font-medium text-[#0757ff] text-sm">ADMIN</p>
						</div>
					</div>

					<div className="space-y-1 px-2 py-3">
						<div className="flex items-center gap-3 px-2 py-2 text-slate-600 text-sm dark:text-slate-300">
							<Phone className="size-5 text-slate-400 dark:text-slate-500" />
							<span>{userPhone}</span>
						</div>

						<div className="flex items-center gap-3 px-2 py-2 text-slate-600 text-sm dark:text-slate-300">
							<Mail className="size-5 text-slate-400 dark:text-slate-500" />
							<span className="truncate">{userEmail}</span>
						</div>

						<DropdownMenuItem onClick={openProfile}>
							<Settings className="size-5" />
							Profile
						</DropdownMenuItem>

						<DropdownMenuItem disabled>
							<Settings className="size-5" />
							Change Password
						</DropdownMenuItem>
					</div>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						className="m-2"
						onClick={signOut}
						variant="destructive"
					>
						<LogOut className="size-5" />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}

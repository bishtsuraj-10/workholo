import {
	createFileRoute,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";

import { SidebarProvider } from "@workholo/ui/components/sidebar";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	// Login page should not use the admin layout.
	if (pathname === "/admin/login") {
		return <Outlet />;
	}

	return (
		<SidebarProvider>
			<div className="flex min-h-svh w-full">
				<AdminSidebar onSecondarySidebarChange={setIsSecondarySidebarOpen} />

				<main
					className={`flex min-w-0 flex-1 flex-col [&>div>main]:transition-[margin] ${
						isSecondarySidebarOpen ? "[&>div>main]:ml-72" : ""
					}`}
				>
					<Outlet />
				</main>
			</div>
		</SidebarProvider>
	);
}

// biome-ignore-all lint/performance/noJsxPropsBind: The action uses the route-local navigator.

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/agent")({
	component: AgentLayout,
});

function AgentLayout() {
	return (
		<div className="flex min-h-svh w-full flex-col bg-[#f5f7fa]">
			<Outlet />
		</div>
	);
}

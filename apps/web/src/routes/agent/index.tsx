// biome-ignore-all lint/performance/noJsxPropsBind: The action uses the route-local navigator.

import { createFileRoute } from "@tanstack/react-router";

import { AgentLeftPanel } from "@/components/agent/agent-left-panel";
import { AgentRightPanel } from "@/components/agent/agent-right-panel";
// import { AgentSidebar } from "@/components/agent/agent-sidebar";
import { AgentTopbar } from "@/components/agent/agent-topbar";
import { CallControls } from "@/components/agent/call-controls";
import { CallInfo } from "@/components/agent/call-info";
import { LeadWorkspace } from "@/components/agent/lead-workspace";

export const Route = createFileRoute("/agent/")({
	component: AgentPage,
});

function AgentPage() {
	return (
		<div className="flex h-svh w-full overflow-hidden bg-[#eef3f9] text-slate-700 dark:bg-[#07111f] dark:text-slate-200">
			{/* AGENT SIDEBAR */}
			{/* <AgentSidebar /> */}

			{/* MAIN APPLICATION */}
			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				{/* TOPBAR */}
				<div className="shrink-0">
					<AgentTopbar />
				</div>

				{/* DIALER AREA */}
				<main className="min-h-0 flex-1 overflow-hidden p-2">
					<div className="flex h-full min-h-0 w-full gap-2">
						{/* ================================= */}
						{/* LEFT PANEL */}
						{/* ================================= */}
						<div className="h-full w-[260px] shrink-0 overflow-hidden">
							<AgentLeftPanel />
						</div>

						{/* ================================= */}
						{/* CENTER PANEL */}
						{/* ================================= */}
						<div className="flex h-full min-w-0 flex-1 flex-col gap-2 overflow-hidden">
							{/* CALL CONTROLS */}
							<div className="shrink-0">
								<CallControls />
							</div>

							{/* CALL INFORMATION */}
							<div className="shrink-0">
								<CallInfo />
							</div>

							{/* LEAD / MANUAL DIAL WORKSPACE */}
							<div className="min-h-0 flex-1 overflow-hidden">
								<LeadWorkspace />
							</div>
						</div>

						{/* ================================= */}
						{/* RIGHT PANEL */}
						{/* ================================= */}
						<div className="h-full w-[340px] shrink-0 overflow-hidden">
							<AgentRightPanel />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

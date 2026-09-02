// biome-ignore-all lint/performance/noJsxPropsBind: Sidebar navigation uses route-specific menu handlers.
// biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: The component preserves the existing nested admin menu hierarchy.

import { useLocation, useNavigate } from "@tanstack/react-router";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@workholo/ui/components/sidebar";

import {
	ChevronLeft,
	ChevronRight,
	LogOut,
	Settings,
	Users,
	Wrench,
} from "lucide-react";

import { useEffect, useState } from "react";

import { type ACL_MODULES, type ACLRoute, findACLRoute } from "@/config/acl";

const toNavigationItem = ({
	icon,
	name,
	path,
}: (typeof ACL_MODULES)[number]) => ({
	icon,
	title: name,
	url: path,
});

const dashboard = findACLRoute("dashboard");
const liveCalls = findACLRoute("live-calls");
const users = findACLRoute("users");
const services = findACLRoute("services");
const settings = findACLRoute("settings");
const calls = findACLRoute("calls");
const callLogs = findACLRoute("call-logs");

if (
	!(
		dashboard &&
		liveCalls &&
		users &&
		services &&
		settings &&
		calls &&
		callLogs
	)
) {
	throw new Error(
		"The ACL navigation tree is missing a required admin module."
	);
}

const navigation = [dashboard, liveCalls].map(toNavigationItem);
const userItems = users.children?.map(toNavigationItem) ?? [];
const serviceItems = (services.children ?? [])
	.filter(
		(item) =>
			![
				"outbound-services",
				"sms-templates",
				"agent-dispositions",
				"survey-campaigns",
				"scheduled-calls",
			].includes(item.id)
	)
	.map(toNavigationItem);
const outboundItems =
	findACLRoute("outbound-services")?.children?.map(toNavigationItem) ?? [];
const templateNavigation = (services.children ?? [])
	.filter((item) =>
		[
			"sms-templates",
			"agent-dispositions",
			"survey-campaigns",
			"scheduled-calls",
		].includes(item.id)
	)
	.map(toNavigationItem);
const otherNavigation = [calls, callLogs].map(toNavigationItem);

type SecondarySidebarSection = "users" | "services" | "settings";

const secondarySidebarRoutes: Record<SecondarySidebarSection, ACLRoute> = {
	services,
	settings,
	users,
};

const isPathActive = (currentPath: string, url: string) => {
	if (url === "/admin") {
		return currentPath === "/admin" || currentPath === "/admin/";
	}

	return currentPath === url || currentPath.startsWith(`${url}/`);
};

const isRouteActive = (route: ACLRoute, currentPath: string): boolean =>
	isPathActive(currentPath, route.path) ||
	route.children?.some((child) => isRouteActive(child, currentPath)) === true;

interface CollapsedSidebarPanelProps {
	currentPath: string;
	onClose: () => void;
	onNavigate: (url: string) => void;
	section: ACLRoute;
}

interface AdminSidebarProps {
	onSecondarySidebarChange: (isOpen: boolean) => void;
}

interface CollapsedSidebarItemProps {
	currentPath: string;
	depth?: number;
	item: ACLRoute;
	itemPath: string[];
	onNavigate: (url: string) => void;
	onToggle: (itemPath: string[]) => void;
	openItemPath: string[];
}

function CollapsedSidebarItem({
	currentPath,
	depth = 0,
	item,
	itemPath,
	onNavigate,
	onToggle,
	openItemPath,
}: CollapsedSidebarItemProps) {
	const hasChildren = Boolean(item.children?.length);
	const Icon = item.icon;
	const active = isRouteActive(item, currentPath);
	const isOpen =
		hasChildren &&
		itemPath.every((itemId, index) => itemId === openItemPath[index]);

	return (
		<li>
			<button
				aria-current={active ? "page" : undefined}
				aria-expanded={hasChildren ? isOpen : undefined}
				className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition-colors ${
					active
						? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
						: "text-slate-600 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
				}`}
				onClick={() => {
					if (hasChildren) {
						onToggle(itemPath);
						return;
					}

					onNavigate(item.path);
				}}
				style={{ paddingLeft: `${depth * 12 + 12}px` }}
				type="button"
			>
				<Icon className="size-4 shrink-0 text-slate-400 dark:text-slate-500" />
				<span className="min-w-0 flex-1 truncate">{item.name}</span>
				{hasChildren ? (
					<ChevronRight
						className={`size-4 shrink-0 text-slate-400 transition-transform dark:text-slate-500 ${
							isOpen ? "rotate-90" : ""
						}`}
					/>
				) : null}
			</button>

			{hasChildren && isOpen ? (
				<ul className="mt-1 space-y-1">
					{item.children?.map((child) => (
						<CollapsedSidebarItem
							currentPath={currentPath}
							depth={depth + 1}
							item={child}
							itemPath={[...itemPath, child.id]}
							key={child.id}
							onNavigate={onNavigate}
							onToggle={onToggle}
							openItemPath={openItemPath}
						/>
					))}
				</ul>
			) : null}
		</li>
	);
}

function CollapsedSidebarPanel({
	currentPath,
	onClose,
	onNavigate,
	section,
}: CollapsedSidebarPanelProps) {
	const Icon = section.icon;
	const [openItemPath, setOpenItemPath] = useState<string[]>([]);

	const toggleItem = (itemPath: string[]) => {
		const isOpen = itemPath.every(
			(itemId, index) => itemId === openItemPath[index]
		);

		setOpenItemPath(isOpen ? itemPath.slice(0, -1) : itemPath);
	};

	return (
		<aside
			aria-label={`${section.name} navigation`}
			className="fixed top-16 bottom-0 left-[var(--sidebar-width-icon)] z-40 hidden w-72 border-slate-200 border-r bg-white shadow-xl md:flex md:flex-col dark:border-slate-800 dark:bg-slate-950"
		>
			<div className="flex items-center gap-2 border-slate-100 border-b px-4 py-4 dark:border-slate-800">
				<Icon className="size-5 text-[#0757ff] dark:text-blue-400" />
				<h2 className="flex-1 font-semibold text-[#102b55] text-sm dark:text-white">
					{section.name}
				</h2>
				<button
					aria-label={`Close ${section.name} navigation`}
					className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
					onClick={onClose}
					type="button"
				>
					<ChevronLeft className="size-5" />
				</button>
			</div>

			<nav className="flex-1 overflow-y-auto p-3">
				<ul className="space-y-1">
					{section.children?.map((item) => (
						<CollapsedSidebarItem
							currentPath={currentPath}
							item={item}
							itemPath={[item.id]}
							key={item.id}
							onNavigate={onNavigate}
							onToggle={toggleItem}
							openItemPath={openItemPath}
						/>
					))}
				</ul>
			</nav>
		</aside>
	);
}

export function AdminSidebar({ onSecondarySidebarChange }: AdminSidebarProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { state } = useSidebar();

	const [usersOpen, setUsersOpen] = useState(false);
	const [servicesOpen, setServicesOpen] = useState(false);
	const [outboundOpen, setOutboundOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [userManagementOpen, setUserManagementOpen] = useState(false);
	const [manageSettingsOpen, setManageSettingsOpen] = useState(false);
	const [manageTeamOpen, setManageTeamOpen] = useState(false);
	const [manageSftpOpen, setManageSftpOpen] = useState(false);
	const [manageAwsOpen, setManageAwsOpen] = useState(false);
	const [businessInformationOpen, setBusinessInformationOpen] = useState(false);
	const [secondarySidebarSection, setSecondarySidebarSection] =
		useState<SecondarySidebarSection | null>(null);

	const currentPath = location.pathname;

	const isCollapsed = state === "collapsed";

	useEffect(() => {
		onSecondarySidebarChange(isCollapsed && secondarySidebarSection !== null);
	}, [isCollapsed, onSecondarySidebarChange, secondarySidebarSection]);

	const isActive = (url: string) => isPathActive(currentPath, url);
	const usersActive = isRouteActive(secondarySidebarRoutes.users, currentPath);
	const servicesActive = isRouteActive(
		secondarySidebarRoutes.services,
		currentPath
	);
	const settingsActive = isRouteActive(
		secondarySidebarRoutes.settings,
		currentPath
	);

	const handleUsersClick = () => {
		if (isCollapsed) {
			setSecondarySidebarSection((section) =>
				section === "users" ? null : "users"
			);
			return;
		}

		setUsersOpen((open) => !open);
	};

	const handleServicesClick = () => {
		if (isCollapsed) {
			setSecondarySidebarSection((section) =>
				section === "services" ? null : "services"
			);
			return;
		}

		setServicesOpen((open) => !open);
	};

	const handleSettingsClick = () => {
		if (isCollapsed) {
			setSecondarySidebarSection((section) =>
				section === "settings" ? null : "settings"
			);
			return;
		}

		setSettingsOpen((open) => !open);
	};

	const navigateFromMainSidebar = (url: string) => {
		setSecondarySidebarSection(null);
		navigate({ to: url });
	};

	const secondarySidebarRoute = secondarySidebarSection
		? secondarySidebarRoutes[secondarySidebarSection]
		: null;

	return (
		<>
			<Sidebar
				className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
				collapsible="icon"
			>
				<SidebarHeader className="border-slate-100 border-b bg-white px-3 py-4 dark:border-slate-800 dark:bg-slate-950">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className="h-10 cursor-default justify-start p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center dark:hover:bg-transparent"
								size="lg"
							>
								<div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#0757ff] text-white shadow-blue-500/20 shadow-sm dark:bg-blue-600">
									<span className="font-bold text-lg">W</span>
								</div>

								<div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
									<span className="truncate font-bold text-[#102b55] text-sm tracking-tight dark:text-white">
										WORKHOLO
									</span>

									<span className="truncate font-medium text-[10px] text-slate-400 uppercase tracking-wider dark:text-slate-500">
										Admin Panel
									</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				{/* =========================================================
			    SIDEBAR CONTENT
			========================================================= */}
				<SidebarContent className="bg-white px-3 py-3 dark:bg-slate-950">
					{/* =====================================================
				    MANAGEMENT
				===================================================== */}
					<SidebarGroup className="p-0">
						<SidebarGroupLabel className="mb-1 px-3 font-bold text-[10px] text-slate-400 uppercase tracking-wider group-data-[collapsible=icon]:hidden dark:text-slate-500">
							Management
						</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu className="gap-1">
								{navigation.map((item) => {
									const Icon = item.icon;
									const active = isActive(item.url);

									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												className={`h-9 rounded-lg px-3 transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
													active
														? "bg-blue-50 font-semibold text-[#0757ff] hover:bg-blue-50 hover:text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-400"
														: "text-slate-600 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
												}`}
												onClick={() => navigateFromMainSidebar(item.url)}
												tooltip={item.title}
											>
												<Icon
													className={`size-4 shrink-0 ${
														active
															? "text-[#0757ff] dark:text-blue-400"
															: "text-slate-400 dark:text-slate-500"
													}`}
												/>

												<span className="text-xs group-data-[collapsible=icon]:hidden">
													{item.title}
												</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}

								<SidebarMenuItem>
									<SidebarMenuButton
										className={`h-9 rounded-lg px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
											usersActive
												? "bg-blue-50 font-semibold text-[#0757ff] hover:bg-blue-50 hover:text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-400"
												: "text-slate-600 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
										}`}
										onClick={handleUsersClick}
										tooltip="Users"
									>
										<Users
											className={`size-4 shrink-0 ${
												usersActive
													? "text-[#0757ff] dark:text-blue-400"
													: "text-slate-400 dark:text-slate-500"
											}`}
										/>

										<span className="text-xs group-data-[collapsible=icon]:hidden">
											Users
										</span>

										<ChevronRight
											className={`ml-auto size-4 shrink-0 text-slate-400 transition-transform group-data-[collapsible=icon]:hidden dark:text-slate-500 ${
												usersOpen ? "rotate-90" : ""
											}`}
										/>
									</SidebarMenuButton>

									{!!usersOpen && (
										<div className="mt-1 ml-4 border-slate-200 border-l pl-2 group-data-[collapsible=icon]:hidden dark:border-slate-800">
											{userItems.map((item) => {
												const active = isActive(item.url);

												return (
													<SidebarMenuItem key={item.title}>
														<SidebarMenuButton
															className={`h-8 rounded-md px-3 ${
																active
																	? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																	: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															}`}
															onClick={() => navigateFromMainSidebar(item.url)}
															size="sm"
															tooltip={item.title}
														>
															<span className="text-[11px]">{item.title}</span>
														</SidebarMenuButton>
													</SidebarMenuItem>
												);
											})}
										</div>
									)}
								</SidebarMenuItem>

								{/* =================================================
							    SERVICES
							================================================= */}
								<SidebarMenuItem>
									<SidebarMenuButton
										className={`h-9 rounded-lg px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
											servicesActive
												? "bg-blue-50 font-semibold text-[#0757ff] hover:bg-blue-50 hover:text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-400"
												: "text-slate-600 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
										}`}
										onClick={handleServicesClick}
										tooltip="Services"
									>
										<Wrench
											className={`size-4 shrink-0 ${
												servicesActive
													? "text-[#0757ff] dark:text-blue-400"
													: "text-slate-400 dark:text-slate-500"
											}`}
										/>

										<span className="text-xs group-data-[collapsible=icon]:hidden">
											Services
										</span>

										<ChevronRight
											className={`ml-auto size-4 shrink-0 text-slate-400 transition-transform group-data-[collapsible=icon]:hidden dark:text-slate-500 ${
												servicesOpen ? "rotate-90" : ""
											}`}
										/>
									</SidebarMenuButton>

									{!!servicesOpen && (
										<div className="mt-1 ml-4 border-slate-200 border-l pl-2 group-data-[collapsible=icon]:hidden dark:border-slate-800">
											{serviceItems.map((item) => {
												const active = isActive(item.url);

												return (
													<SidebarMenuItem key={item.title}>
														<SidebarMenuButton
															className={`h-8 rounded-md px-3 ${
																active
																	? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																	: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															}`}
															onClick={() =>
																navigate({
																	to: item.url,
																})
															}
															size="sm"
															tooltip={item.title}
														>
															<span className="text-[11px]">{item.title}</span>
														</SidebarMenuButton>
													</SidebarMenuItem>
												);
											})}

											<SidebarMenuItem className="mt-1">
												<SidebarMenuButton
													className="h-8 rounded-md px-3 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
													onClick={() => setOutboundOpen((open) => !open)}
													size="sm"
													tooltip="Outbound Services"
												>
													<span className="text-[11px]">Outbound Services</span>

													<ChevronRight
														className={`ml-auto size-3.5 text-slate-400 transition-transform dark:text-slate-500 ${
															outboundOpen ? "rotate-90" : ""
														}`}
													/>
												</SidebarMenuButton>

												{!!outboundOpen && (
													<div className="mt-1 ml-3 border-slate-200 border-l pl-2 dark:border-slate-800">
														{outboundItems.map((item) => {
															const active = isActive(item.url);

															return (
																<SidebarMenuItem key={item.title}>
																	<SidebarMenuButton
																		className={`h-7 rounded-md px-2 ${
																			active
																				? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																				: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																		}`}
																		onClick={() =>
																			navigate({
																				to: item.url,
																			})
																		}
																		size="sm"
																		tooltip={item.title}
																	>
																		<span className="text-[10px]">
																			{item.title}
																		</span>
																	</SidebarMenuButton>
																</SidebarMenuItem>
															);
														})}
													</div>
												)}
											</SidebarMenuItem>

											{templateNavigation.map((item) => {
												const active = isActive(item.url);

												return (
													<SidebarMenuItem className="mt-1" key={item.title}>
														<SidebarMenuButton
															className={`h-8 rounded-md px-3 ${
																active
																	? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																	: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															}`}
															onClick={() =>
																navigate({
																	to: item.url,
																})
															}
															size="sm"
															tooltip={item.title}
														>
															<span className="text-[11px]">{item.title}</span>
														</SidebarMenuButton>
													</SidebarMenuItem>
												);
											})}
										</div>
									)}
								</SidebarMenuItem>

								<SidebarMenuItem className="mt-1">
									<SidebarMenuButton
										className={`h-9 rounded-lg px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
											settingsActive
												? "bg-blue-50 font-semibold text-[#0757ff] hover:bg-blue-50 hover:text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-400"
												: "text-slate-600 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
										}`}
										onClick={handleSettingsClick}
										tooltip="Settings"
									>
										<Settings
											className={`size-4 shrink-0 ${
												settingsActive
													? "text-[#0757ff] dark:text-blue-400"
													: "text-slate-400 dark:text-slate-500"
											}`}
										/>

										<span className="text-xs group-data-[collapsible=icon]:hidden">
											Settings
										</span>

										<ChevronRight
											className={`ml-auto size-4 shrink-0 text-slate-400 transition-transform group-data-[collapsible=icon]:hidden dark:text-slate-500 ${
												settingsOpen ? "rotate-90" : ""
											}`}
										/>
									</SidebarMenuButton>

									{!!settingsOpen && (
										<div className="mt-1 ml-4 border-slate-200 border-l pl-2 group-data-[collapsible=icon]:hidden dark:border-slate-800">
											<SidebarMenuItem>
												<SidebarMenuButton
													className="h-8 rounded-md px-3 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
													onClick={() => setUserManagementOpen((open) => !open)}
													size="sm"
													tooltip="User Management"
												>
													<span className="text-[11px]">User Management</span>

													<ChevronRight
														className={`ml-auto size-3.5 text-slate-400 transition-transform dark:text-slate-500 ${
															userManagementOpen ? "rotate-90" : ""
														}`}
													/>
												</SidebarMenuButton>

												{!!userManagementOpen && (
													<div className="mt-1 ml-3 border-slate-200 border-l pl-2 dark:border-slate-800">
														{/* MANAGE ROLES */}
														<SidebarMenuItem>
															<SidebarMenuButton
																className="h-8 rounded-md px-2 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																onClick={() =>
																	navigate({
																		to: "/admin/all-roles-and-permissions",
																	})
																}
																size="sm"
																tooltip="Manage Roles"
															>
																<span className="text-[11px]">
																	Manage Roles
																</span>
															</SidebarMenuButton>
														</SidebarMenuItem>

														{/* MANAGE TEAM */}
														<SidebarMenuItem className="mt-1">
															<SidebarMenuButton
																className="h-8 rounded-md px-2 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																onClick={() =>
																	setManageTeamOpen((open) => !open)
																}
																size="sm"
																tooltip="Manage Team"
															>
																<span className="text-[11px]">Manage Team</span>

																<ChevronRight
																	className={`ml-auto size-3.5 text-slate-400 transition-transform dark:text-slate-500 ${
																		manageTeamOpen ? "rotate-90" : ""
																	}`}
																/>
															</SidebarMenuButton>

															{!!manageTeamOpen && (
																<div className="mt-1 ml-3 border-slate-200 border-l pl-2 dark:border-slate-800">
																	<SidebarMenuItem>
																		<SidebarMenuButton
																			className={`h-7 rounded-md px-2 ${
																				isActive("/admin/show-member")
																					? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																					: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																			}`}
																			onClick={() =>
																				navigate({
																					to: "/admin/show-member",
																				})
																			}
																			size="sm"
																			tooltip="All Members"
																		>
																			<span className="text-[10px]">
																				All Members
																			</span>
																		</SidebarMenuButton>
																	</SidebarMenuItem>
																</div>
															)}
														</SidebarMenuItem>
													</div>
												)}
											</SidebarMenuItem>

											<SidebarMenuItem className="mt-1">
												<SidebarMenuButton
													className="h-8 rounded-md px-3 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
													onClick={() => setManageSettingsOpen((open) => !open)}
													size="sm"
													tooltip="Manage Settings"
												>
													<span className="text-[11px]">Manage Settings</span>

													<ChevronRight
														className={`ml-auto size-3.5 text-slate-400 transition-transform dark:text-slate-500 ${
															manageSettingsOpen ? "rotate-90" : ""
														}`}
													/>
												</SidebarMenuButton>
											</SidebarMenuItem>
											{!!manageSettingsOpen && (
												<div className="mt-1 ml-3 border-slate-200 border-l pl-2 dark:border-slate-800">
													{/* MANAGE SFTP */}
													<SidebarMenuItem>
														<SidebarMenuButton
															className="h-8 rounded-md px-2 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															onClick={() => setManageSftpOpen((open) => !open)}
															size="sm"
															tooltip="Manage SFTP"
														>
															<span className="text-[11px]">Manage SFTP</span>

															<ChevronRight
																className={`ml-auto size-3.5 text-slate-400 transition-transform dark:text-slate-500 ${
																	manageSftpOpen ? "rotate-90" : ""
																}`}
															/>
														</SidebarMenuButton>

														{!!manageSftpOpen && (
															<div className="mt-1 ml-3 border-slate-200 border-l pl-2 dark:border-slate-800">
																{[
																	["Add SFTP", "/admin/add-sftp"],
																	["All SFTP", "/admin/sftp"],
																].map(([title, url]) => (
																	<SidebarMenuItem key={title}>
																		<SidebarMenuButton
																			className={`h-7 rounded-md px-2 ${
																				isActive(url)
																					? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																					: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																			}`}
																			onClick={() =>
																				navigate({
																					to: url,
																				})
																			}
																			size="sm"
																			tooltip={title}
																		>
																			<span className="text-[10px]">
																				{title}
																			</span>
																		</SidebarMenuButton>
																	</SidebarMenuItem>
																))}
															</div>
														)}
													</SidebarMenuItem>

													{/* MANAGE AWS */}
													<SidebarMenuItem className="mt-1">
														<SidebarMenuButton
															className="h-8 rounded-md px-2 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															onClick={() => setManageAwsOpen((open) => !open)}
															size="sm"
															tooltip="Manage AWS"
														>
															<span className="text-[11px]">Manage AWS</span>

															<ChevronRight
																className={`ml-auto size-3.5 text-slate-400 transition-transform dark:text-slate-500 ${
																	manageAwsOpen ? "rotate-90" : ""
																}`}
															/>
														</SidebarMenuButton>

														{!!manageAwsOpen && (
															<div className="mt-1 ml-3 border-slate-200 border-l pl-2 dark:border-slate-800">
																<SidebarMenuItem>
																	<SidebarMenuButton
																		className={`h-7 rounded-md px-2 ${
																			isActive("/admin/remote-storage")
																				? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																				: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																		}`}
																		onClick={() =>
																			navigate({
																				to: "/admin/remote-storage",
																			})
																		}
																		size="sm"
																		tooltip="Manage Remote Storage"
																	>
																		<span className="text-[10px]">
																			Manage Remote Storage
																		</span>
																	</SidebarMenuButton>
																</SidebarMenuItem>
															</div>
														)}
													</SidebarMenuItem>

													{/* RECORDING FOLDER STRUCTURE */}
													<SidebarMenuItem className="mt-1">
														<SidebarMenuButton
															className={`h-8 rounded-md px-3 ${
																isActive("/admin/recording-folder-structure")
																	? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																	: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															}`}
															onClick={() =>
																navigate({
																	to: "/admin/recording-folder-structure",
																})
															}
															size="sm"
															tooltip="Recording Folder Structure"
														>
															<span className="text-[11px]">
																Recording Folder Structure
															</span>
														</SidebarMenuButton>
													</SidebarMenuItem>

													{/* IP POOL */}
													<SidebarMenuItem className="mt-1">
														<SidebarMenuButton
															className={`h-8 rounded-md px-3 ${
																isActive("/admin/ip-pool-whitelisting")
																	? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																	: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															}`}
															onClick={() =>
																navigate({
																	to: "/admin/ip-pool-whitelisting",
																})
															}
															size="sm"
															tooltip="IP Pool Whitelisting"
														>
															<span className="text-[11px]">
																IP Pool Whitelisting
															</span>
														</SidebarMenuButton>
													</SidebarMenuItem>

													{/* BUSINESS INFORMATION */}
													<SidebarMenuItem className="mt-1">
														<SidebarMenuButton
															className="h-8 rounded-md px-3 text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
															onClick={() =>
																setBusinessInformationOpen((open) => !open)
															}
															size="sm"
															tooltip="Business Information"
														>
															<span className="text-[11px]">
																Business Information
															</span>

															<ChevronRight
																className={`ml-auto size-3.5 text-slate-400 transition-transform dark:text-slate-500 ${
																	businessInformationOpen ? "rotate-90" : ""
																}`}
															/>
														</SidebarMenuButton>

														{!!businessInformationOpen && (
															<div className="mt-1 ml-3 border-slate-200 border-l pl-2 dark:border-slate-800">
																{[
																	["Profile", "/admin/profile"],
																	[
																		"Notification Management",
																		"/admin/notification-management",
																	],
																].map(([title, url]) => (
																	<SidebarMenuItem key={title}>
																		<SidebarMenuButton
																			className={`h-7 rounded-md px-2 ${
																				isActive(url)
																					? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																					: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																			}`}
																			onClick={() =>
																				navigate({
																					to: url,
																				})
																			}
																			size="sm"
																			tooltip={title}
																		>
																			<span className="text-[10px]">
																				{title}
																			</span>
																		</SidebarMenuButton>
																	</SidebarMenuItem>
																))}
															</div>
														)}
													</SidebarMenuItem>

													{/* SIMPLE SETTINGS ITEMS */}
													{[
														["Reset Password", "/admin/reset-password"],
														[
															"CDP List Management",
															"/admin/cdp-list-management",
														],
														["Sign Out", "/admin/sign-out"],
													].map(([title, url]) => (
														<SidebarMenuItem className="mt-1" key={title}>
															<SidebarMenuButton
																className={`h-8 rounded-md px-3 ${
																	isActive(url)
																		? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
																		: "text-slate-500 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
																}`}
																onClick={() =>
																	navigate({
																		to: url,
																	})
																}
																size="sm"
																tooltip={title}
															>
																<span className="text-[11px]">{title}</span>
															</SidebarMenuButton>
														</SidebarMenuItem>
													))}
												</div>
											)}
										</div>
									)}
								</SidebarMenuItem>

								{/* =================================================
							    CALLS + CALL LOGS
							================================================= */}
								{otherNavigation.map((item) => {
									const Icon = item.icon;
									const active = isActive(item.url);

									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												className={`h-9 rounded-lg px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 ${
													active
														? "bg-blue-50 font-semibold text-[#0757ff] dark:bg-blue-950/60 dark:text-blue-400"
														: "text-slate-600 hover:bg-slate-50 hover:text-[#0757ff] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-400"
												}`}
												onClick={() =>
													navigate({
														to: item.url,
													})
												}
												tooltip={item.title}
											>
												<Icon
													className={`size-4 shrink-0 ${
														active
															? "text-[#0757ff] dark:text-blue-400"
															: "text-slate-400 dark:text-slate-500"
													}`}
												/>

												<span className="text-xs group-data-[collapsible=icon]:hidden">
													{item.title}
												</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter className="border-slate-100 border-t bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className="h-9 rounded-lg px-3 text-slate-500 hover:bg-red-50 hover:text-red-600 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
								tooltip="Logout"
							>
								<LogOut className="size-4 shrink-0" />

								<span className="text-xs group-data-[collapsible=icon]:hidden">
									Logout
								</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>

			{isCollapsed && secondarySidebarRoute ? (
				<CollapsedSidebarPanel
					currentPath={currentPath}
					onClose={() => setSecondarySidebarSection(null)}
					onNavigate={(url) => {
						navigate({ to: url });
						setSecondarySidebarSection(null);
					}}
					section={secondarySidebarRoute}
				/>
			) : null}
		</>
	);
}

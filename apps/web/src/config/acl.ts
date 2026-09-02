import type { LucideIcon } from "lucide-react";
import {
	Ban,
	BarChart3,
	Bell,
	Building2,
	CalendarClock,
	CalendarDays,
	ClipboardList,
	CloudCog,
	Database,
	FileText,
	FolderTree,
	Headphones,
	LayoutDashboard,
	ListChecks,
	LockKeyhole,
	Network,
	Phone,
	Radio,
	ScrollText,
	Settings,
	ShieldCheck,
	Upload,
	UserPlus,
	UserRound,
	Users,
	UsersRound,
	Wrench,
} from "lucide-react";

export type ACLPermission = "view" | "create" | "update" | "delete";

export interface ACLRoute {
	children?: ACLRoute[];
	hidden?: boolean;
	icon: LucideIcon;
	id: string;
	name: string;
	path: string;
	permission: string;
	permissions: ACLPermission[];
}

const view = (_permission: string): ACLPermission[] => ["view"];
const manage = (permission: string): ACLPermission[] => [
	...view(permission),
	"create",
	"update",
	"delete",
];

export const ACL_MODULES: ACLRoute[] = [
	{
		icon: LayoutDashboard,
		id: "dashboard",
		name: "Dashboard",
		path: "/admin",
		permission: "dashboard.view",
		permissions: view("dashboard"),
	},
	{
		icon: Radio,
		id: "live-calls",
		name: "Live Calls",
		path: "/admin/livecalls",
		permission: "live-calls.view",
		permissions: view("live-calls"),
	},
	{
		children: [
			{
				icon: Users,
				id: "users-list",
				name: "All User(s)",
				path: "/admin/show-users",
				permission: "users.list",
				permissions: view("users.list"),
			},
			{
				icon: UserPlus,
				id: "users-add",
				name: "Add User",
				path: "/admin/add-new-user",
				permission: "users.create",
				permissions: manage("users"),
			},
			{
				icon: ClipboardList,
				id: "users-pending",
				name: "Pending User(s)",
				path: "/admin/pending-users",
				permission: "users.pending.view",
				permissions: view("users.pending"),
			},
			{
				icon: UsersRound,
				id: "agent-groups",
				name: "Teams (Agent Groups)",
				path: "/admin/agent-groups",
				permission: "agent-groups.view",
				permissions: manage("agent-groups"),
			},
			{
				icon: UsersRound,
				id: "team-members",
				name: "All Members",
				path: "/admin/show-member",
				permission: "team-members.view",
				permissions: view("team-members"),
			},
			{
				icon: UsersRound,
				id: "member-groups",
				name: "Member Groups",
				path: "/admin/member-groups",
				permission: "member-groups.view",
				permissions: manage("member-groups"),
			},
		],
		icon: Users,
		id: "users",
		name: "Users",
		path: "/admin/users",
		permission: "users.view",
		permissions: manage("users"),
	},
	{
		children: [
			{
				children: [
					{
						icon: Ban,
						id: "numbers-block",
						name: "Block a Number",
						path: "/admin/block-calls",
						permission: "numbers.block.create",
						permissions: manage("numbers.block"),
					},
					{
						icon: Ban,
						id: "numbers-blocked",
						name: "Blocked Numbers",
						path: "/admin/blocked-numbers",
						permission: "numbers.blocked.view",
						permissions: manage("numbers.blocked"),
					},
				],
				icon: Phone,
				id: "numbers",
				name: "My Numbers",
				path: "/admin/manage-did-numbers",
				permission: "numbers.view",
				permissions: manage("numbers"),
			},
			{
				icon: Headphones,
				id: "extensions",
				name: "Agents",
				path: "/admin/extensions",
				permission: "extensions.view",
				permissions: manage("extensions"),
			},
			{
				children: [
					{
						icon: Building2,
						id: "departments-add",
						name: "Add Department",
						path: "/admin/add-department",
						permission: "departments.create",
						permissions: manage("departments"),
					},
				],
				icon: Building2,
				id: "departments",
				name: "Departments",
				path: "/admin/departments",
				permission: "departments.view",
				permissions: manage("departments"),
			},
			{
				children: [
					{
						children: [
							{
								icon: UserPlus,
								id: "dialer-campaigns-add",
								name: "Add Dialer Campaign",
								path: "/admin/add-dialer-campaign",
								permission: "dialer-campaigns.create",
								permissions: manage("dialer-campaigns"),
							},
						],
						icon: Radio,
						id: "dialer-campaigns",
						name: "Dialer Campaigns",
						path: "/admin/dialer-campaigns",
						permission: "dialer-campaigns.view",
						permissions: manage("dialer-campaigns"),
					},
					{
						children: [
							{
								icon: UserPlus,
								id: "inbound-queues-add",
								name: "Add Inbound Queue",
								path: "/admin/add-inbound-queue",
								permission: "inbound-queues.create",
								permissions: manage("inbound-queues"),
							},
						],
						icon: Phone,
						id: "inbound-queues",
						name: "Dialer Inbound Queue",
						path: "/admin/show-inbound-queue",
						permission: "inbound-queues.view",
						permissions: manage("inbound-queues"),
					},
					{
						children: [
							{
								icon: UserPlus,
								id: "lead-lists-add",
								name: "Add Lead List",
								path: "/admin/add-list",
								permission: "lead-lists.create",
								permissions: manage("lead-lists"),
							},
							{
								icon: Upload,
								id: "lead-upload-logs",
								name: "Upload Lead Logs",
								path: "/admin/upload-lead-logs",
								permission: "lead-lists.upload.view",
								permissions: view("lead-lists.upload"),
							},
						],
						icon: ListChecks,
						id: "lead-lists",
						name: "Lead Lists",
						path: "/admin/manage-leads",
						permission: "lead-lists.view",
						permissions: manage("lead-lists"),
					},
					{
						children: [
							{
								icon: UserPlus,
								id: "dispositions-add",
								name: "Add Disposition",
								path: "/admin/add-disposition",
								permission: "disposition-lists.create",
								permissions: manage("disposition-lists"),
							},
						],
						icon: ClipboardList,
						id: "disposition-lists",
						name: "Disposition Lists",
						path: "/admin/manage-disposition-list",
						permission: "disposition-lists.view",
						permissions: manage("disposition-lists"),
					},
					{
						icon: ListChecks,
						id: "pause-code-lists",
						name: "Pause Code Lists",
						path: "/admin/break-lists",
						permission: "pause-code-lists.view",
						permissions: manage("pause-code-lists"),
					},
					{
						icon: Ban,
						id: "dnd-lists",
						name: "Account DND Lists",
						path: "/admin/dnd/manage-list",
						permission: "dnd-lists.view",
						permissions: manage("dnd-lists"),
					},
					{
						icon: Phone,
						id: "quick-transfer-lists",
						name: "Quick Transfer Lists",
						path: "/admin/manage-quick-transfer-list",
						permission: "quick-transfer-lists.view",
						permissions: manage("quick-transfer-lists"),
					},
					{
						icon: ClipboardList,
						id: "csat-survey",
						name: "CSAT Survey",
						path: "/admin/manage-csat-survey",
						permission: "csat-survey.view",
						permissions: manage("csat-survey"),
					},
					{
						icon: ListChecks,
						id: "dialer-skill-lists",
						name: "Dialer Skill Lists",
						path: "/admin/dialer-skill-lists",
						permission: "dialer-skill-lists.view",
						permissions: manage("dialer-skill-lists"),
					},
					{
						icon: ScrollText,
						id: "agent-script",
						name: "Agent Script",
						path: "/admin/agent-script",
						permission: "agent-script.view",
						permissions: manage("agent-script"),
					},
					{
						icon: CalendarDays,
						id: "holiday-calendar",
						name: "Holiday Calendar",
						path: "/admin/holiday-calendar",
						permission: "holiday-calendar.view",
						permissions: manage("holiday-calendar"),
					},
				],
				icon: Phone,
				id: "outbound-services",
				name: "Outbound Services",
				path: "/admin/dialer-campaigns",
				permission: "outbound.view",
				permissions: view("outbound"),
			},
			{
				children: [
					{
						icon: UserPlus,
						id: "sms-templates-add",
						name: "Add SMS Template",
						path: "/admin/add-sms-templates",
						permission: "sms-templates.create",
						permissions: manage("sms-templates"),
					},
				],
				icon: FileText,
				id: "sms-templates",
				name: "Template Management",
				path: "/admin/sms-templates",
				permission: "sms-templates.view",
				permissions: manage("sms-templates"),
			},
			{
				icon: ClipboardList,
				id: "agent-dispositions",
				name: "Agent Dispositions",
				path: "/admin/agent-dispositions",
				permission: "agent-dispositions.view",
				permissions: manage("agent-dispositions"),
			},
			{
				children: [
					{
						icon: UserPlus,
						id: "survey-campaigns-add",
						name: "Add Survey Campaign",
						path: "/admin/add-survey-campaign",
						permission: "survey-campaigns.create",
						permissions: manage("survey-campaigns"),
					},
				],
				icon: CalendarClock,
				id: "survey-campaigns",
				name: "Survey Campaign",
				path: "/admin/survey-campaigns",
				permission: "survey-campaigns.view",
				permissions: manage("survey-campaigns"),
			},
			{
				icon: CalendarClock,
				id: "scheduled-calls",
				name: "Scheduled Calls",
				path: "/admin/scheduled-calls",
				permission: "scheduled-calls.view",
				permissions: manage("scheduled-calls"),
			},
		],
		icon: Wrench,
		id: "services",
		name: "Services",
		path: "/admin/manage-did-numbers",
		permission: "services.view",
		permissions: view("services"),
	},
	{
		children: [
			{
				children: [
					{
						icon: UserPlus,
						id: "roles-add",
						name: "Add User Role",
						path: "/admin/add-role",
						permission: "roles.create",
						permissions: manage("roles"),
					},
				],
				icon: ShieldCheck,
				id: "roles",
				name: "Manage Roles",
				path: "/admin/all-roles-and-permissions",
				permission: "roles.view",
				permissions: manage("roles"),
			},
			{
				children: [
					{
						icon: UserPlus,
						id: "sftp-add",
						name: "Add SFTP",
						path: "/admin/add-sftp",
						permission: "sftp.create",
						permissions: manage("sftp"),
					},
				],
				icon: Database,
				id: "sftp",
				name: "Manage SFTP",
				path: "/admin/sftp",
				permission: "sftp.view",
				permissions: manage("sftp"),
			},
			{
				icon: CloudCog,
				id: "remote-storage",
				name: "Manage Remote Storage",
				path: "/admin/remote-storage",
				permission: "remote-storage.view",
				permissions: manage("remote-storage"),
			},
			{
				icon: FolderTree,
				id: "recording-folders",
				name: "Recording Folder Structure",
				path: "/admin/recording-folder-structure",
				permission: "recording-folders.view",
				permissions: manage("recording-folders"),
			},
			{
				children: [
					{
						icon: UserPlus,
						id: "ip-pool-add",
						name: "Add IP Pool",
						path: "/admin/add-new-ip-pool",
						permission: "ip-pool.create",
						permissions: manage("ip-pool"),
					},
				],
				icon: Network,
				id: "ip-pool",
				name: "IP Pool Whitelisting",
				path: "/admin/ip-pool-whitelisting",
				permission: "ip-pool.view",
				permissions: manage("ip-pool"),
			},
			{
				icon: UserRound,
				id: "profile",
				name: "Profile",
				path: "/admin/profile",
				permission: "profile.view",
				permissions: view("profile"),
			},
			{
				icon: Bell,
				id: "notifications",
				name: "Notification Management",
				path: "/admin/notification-management",
				permission: "notifications.view",
				permissions: manage("notifications"),
			},
			{
				icon: LockKeyhole,
				id: "reset-password",
				name: "Reset Password",
				path: "/admin/reset-password",
				permission: "password.update",
				permissions: ["update"],
			},
		],
		icon: Settings,
		id: "settings",
		name: "Settings",
		path: "/admin/settings",
		permission: "settings.view",
		permissions: manage("settings"),
	},
	{
		icon: Phone,
		id: "calls",
		name: "Calls",
		path: "/admin/calls",
		permission: "calls.view",
		permissions: view("calls"),
	},
	{
		icon: BarChart3,
		id: "call-logs",
		name: "Call Logs",
		path: "/admin/call-logs",
		permission: "call-logs.view",
		permissions: view("call-logs"),
	},
	{
		hidden: true,
		icon: LockKeyhole,
		id: "admin-login",
		name: "Admin Login",
		path: "/admin/login",
		permission: "admin-login.view",
		permissions: view("admin-login"),
	},
	{
		hidden: true,
		icon: LayoutDashboard,
		id: "home",
		name: "Home",
		path: "/",
		permission: "home.view",
		permissions: view("home"),
	},
	{
		hidden: true,
		icon: LockKeyhole,
		id: "authentication",
		name: "Authentication",
		path: "/auth",
		permission: "authentication.view",
		permissions: view("authentication"),
	},
];

export function findACLRoute(
	id: string,
	routes = ACL_MODULES
): ACLRoute | undefined {
	for (const route of routes) {
		if (route.id === id) {
			return route;
		}
		const foundRoute = route.children
			? findACLRoute(id, route.children)
			: undefined;
		if (foundRoute) {
			return foundRoute;
		}
	}
}

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../hooks/useAuth";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    User,
    Calendar,
    Tag,
    ShieldAlert,
    MessageSquare,
    Clock,
    Trash2,
} from "lucide-react";

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [staffList, setStaffList] = useState([]);

    // For Updates
    const [statusUpdate, setStatusUpdate] = useState("");
    const [assigneeUpdate, setAssigneeUpdate] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTicketDetails(id);
            if (user?.role === "admin") {
                fetchStaffMembers();
            }
        }
    }, [id, user?.role]);

    const fetchTicketDetails = async (ticketId) => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/tickets/${ticketId}`);
            setTicket(res.data);
            setStatusUpdate(res.data.status);
            setAssigneeUpdate(res.data.assigned_to || "");
        } catch (err) {
            console.error("Error fetching ticket:", err);
            toast.error("Failed to load ticket details.");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffMembers = async () => {
        try {
            const res = await apiClient.get("/admin/users");
            setStaffList(res.data.filter((u) => u.role === "staff"));
        } catch (err) {
            console.error("Failed to fetch staff:", err);
        }
    };

    const handleUpdateTicket = async () => {
        try {
            setUpdating(true);

            // Determine if there are actual changes
            const hasStatusChange =
                statusUpdate && statusUpdate !== ticket.status;
            const targetAssigneeId = assigneeUpdate || "";
            const currentAssigneeId = ticket.assigned_to || "";
            const hasAssigneeChange =
                user?.role === "admin" &&
                targetAssigneeId !== currentAssigneeId;

            if (!hasStatusChange && !hasAssigneeChange) {
                toast("No changes to update.", { icon: "ℹ️" });
                return;
            }

            if (user?.role === "admin") {
                if (hasAssigneeChange) {
                    await apiClient.put(`/admin/tickets/${ticket.id}/assign`, {
                        assigned_to: targetAssigneeId,
                    });
                }
                if (hasStatusChange) {
                    await apiClient.put(`/admin/tickets/${ticket.id}/status`, {
                        status: statusUpdate,
                    });
                }
            } else if (user?.role === "staff") {
                if (hasStatusChange) {
                    await apiClient.put(
                        `/staff/tickets/${ticket.id}/progress`,
                        {
                            status: statusUpdate,
                        },
                    );
                }
            }

            toast.success("Ticket updated successfully!");
            fetchTicketDetails(ticket.id); // Refresh data
        } catch (err) {
            console.error("Update error:", err);
            toast.error(
                err.response?.data?.detail || "Failed to update ticket.",
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteTicket = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this ticket? This action cannot be undone.",
            )
        ) {
            return;
        }

        try {
            setUpdating(true);
            await apiClient.delete(`/admin/tickets/${ticket.id}`);
            toast.success("Ticket deleted successfully.");
            navigate("/admin");
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(
                err.response?.data?.detail || "Failed to delete ticket.",
            );
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!ticket) return null;

    const canEdit = user?.role === "admin" || user?.role === "staff";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Nav Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-2"
            >
                <ArrowLeft size={16} className="mr-1.5" />
                Back to Dashboard
            </button>

            {/* Main Header Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 font-mono text-sm text-gray-500">
                            <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 tracking-tight">
                                {ticket.ticket_id}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                                <Clock size={14} className="mr-1.5" />
                                {format(
                                    new Date(ticket.created_at),
                                    "MMM d, yyyy 'at' h:mm a",
                                )}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight leading-tight">
                            {ticket.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <StatusBadge status={ticket.status} />
                            <PriorityBadge priority={ticket.priority} />
                            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                <Tag
                                    size={14}
                                    className="mr-1.5 text-gray-400"
                                />
                                {ticket.category.replace("_", " ")}
                            </div>
                        </div>
                    </div>

                    {user?.role === "admin" && (
                        <button
                            onClick={handleDeleteTicket}
                            disabled={updating}
                            className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors shadow-sm font-medium text-sm border border-red-200"
                            title="Delete Ticket"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    )}
                </div>

                <div className="p-6 sm:p-8">
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 whitespace-pre-wrap">
                        {ticket.description}
                    </div>
                </div>
            </div>

            {/* Sidebar / Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 col-span-1 md:col-span-2">
                    <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4 border-b border-gray-100 pb-3 flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        Requester Information
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Name</span>
                            <span className="text-sm font-medium text-black">
                                {ticket.user?.name || "Unknown User"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Email</span>
                            <span className="text-sm font-medium text-black">
                                {ticket.user?.email || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500">
                                Department
                            </span>
                            <span className="text-sm font-medium text-black">
                                {ticket.user?.department || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Assigned Staff Info & Updates */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 col-span-1">
                    <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4 border-b border-gray-100 pb-3 flex items-center">
                        <ShieldAlert size={16} className="mr-2 text-gray-400" />
                        Ticket Status
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <span className="block text-xs text-gray-500 mb-1">
                                Assigned To
                            </span>
                            <span className="text-sm font-medium text-black">
                                {ticket.assigned_staff?.name || "Unassigned"}
                                {ticket.assigned_staff?.department
                                    ? ` (${ticket.assigned_staff.department})`
                                    : ""}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 mb-1">
                                Current Status
                            </span>
                            <span className="text-sm font-medium capitalize text-black">
                                {ticket.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>

                    {canEdit && (
                        /* Edit view for admins and staff - moved below info */
                        <div className="space-y-5 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Status
                                </label>
                                <select
                                    value={statusUpdate}
                                    onChange={(e) =>
                                        setStatusUpdate(e.target.value)
                                    }
                                    className="w-full text-sm border-gray-300 rounded-md focus:ring-black focus:border-black py-2 bg-gray-50 shadow-sm"
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="ASSIGNED">Assigned</option>
                                    <option value="IN_PROGRESS">
                                        In Progress
                                    </option>
                                    <option value="RESOLVED">Resolved</option>
                                    {user?.role === "admin" && (
                                        <option value="CLOSED">Closed</option>
                                    )}
                                </select>
                            </div>

                            {user?.role === "admin" && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                        Assign To
                                    </label>
                                    <select
                                        value={assigneeUpdate}
                                        onChange={(e) =>
                                            setAssigneeUpdate(e.target.value)
                                        }
                                        className="w-full text-sm border-gray-300 rounded-md focus:ring-black focus:border-black py-2 bg-gray-50 shadow-sm"
                                    >
                                        <option value="">Unassigned</option>
                                        {staffList.map((staff) => (
                                            <option
                                                key={staff.id}
                                                value={staff.id}
                                            >
                                                {staff.name} ({staff.department}
                                                )
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={handleUpdateTicket}
                                disabled={updating}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
                            >
                                {updating ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;

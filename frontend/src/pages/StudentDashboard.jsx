import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import TicketCard from "../components/TicketCard";
import { useAuth } from "../hooks/useAuth";
import { format } from "date-fns";
import {
    PlusCircle,
    Search,
    Filter,
    AlertCircle,
    FileText,
} from "lucide-react";
import toast from "react-hot-toast";

const StudentDashboard = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/tickets/my");
            setTickets(res.data);
        } catch (err) {
            toast.error("Failed to load tickets.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticket_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "All" ||
            ticket.status === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        Welcome, {user?.name.split(" ")[0]}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 max-w-xl">
                        View and track the progress of your submitted
                        complaints.
                    </p>
                </div>

                <Link
                    to="/submit"
                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors shadow-sm font-medium text-sm"
                >
                    <PlusCircle size={16} />
                    New Ticket
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col hover:border-gray-300 transition-colors">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                    </span>
                    <span className="text-3xl font-bold text-black mt-2">
                        {tickets.length}
                    </span>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col hover:border-gray-300 transition-colors">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open
                    </span>
                    <span className="text-3xl font-bold text-blue-600 mt-2">
                        {tickets.filter((t) => t.status === "open").length}
                    </span>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col hover:border-gray-300 transition-colors">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        In Progress
                    </span>
                    <span className="text-3xl font-bold text-yellow-600 mt-2">
                        {
                            tickets.filter((t) => t.status === "in_progress")
                                .length
                        }
                    </span>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col hover:border-gray-300 transition-colors">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resolved
                    </span>
                    <span className="text-3xl font-bold text-green-600 mt-2">
                        {tickets.filter((t) => t.status === "resolved").length}
                    </span>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white shadow-sm transition-colors placeholder-gray-400"
                        placeholder="Search tickets by title or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="relative w-full sm:w-auto min-w-[160px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter size={16} className="text-gray-400" />
                    </div>
                    <select
                        className="block w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white shadow-sm transition-colors appearance-none font-medium text-gray-700"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                </div>
            ) : filteredTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center mb-4 text-gray-400">
                        {searchTerm || statusFilter !== "All" ? (
                            <Search size={24} />
                        ) : (
                            <FileText size={24} />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-1">
                        {searchTerm || statusFilter !== "All"
                            ? "No matching tickets"
                            : "No tickets yet"}
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm">
                        {searchTerm || statusFilter !== "All"
                            ? "Try adjusting your search query or status filters."
                            : "You haven't submitted any tickets yet. When you do, track them here."}
                    </p>
                    {!(searchTerm || statusFilter !== "All") && (
                        <Link
                            to="/submit"
                            className="mt-6 inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition shadow-sm text-sm font-medium"
                        >
                            Submit your first ticket
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;

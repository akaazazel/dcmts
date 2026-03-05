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
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome, {user?.name.split(" ")[0]}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        View and track the progress of your submitted
                        complaints.
                    </p>
                </div>

                <Link
                    to="/submit"
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-hover transition-colors shadow-sm font-medium"
                >
                    <PlusCircle size={20} />
                    New Complaint
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                        Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900 mt-1">
                        {tickets.length}
                    </span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                        Open
                    </span>
                    <span className="text-2xl font-bold text-blue-600 mt-1">
                        {tickets.filter((t) => t.status === "open").length}
                    </span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                        In Progress
                    </span>
                    <span className="text-2xl font-bold text-yellow-600 mt-1">
                        {
                            tickets.filter((t) => t.status === "in_progress")
                                .length
                        }
                    </span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                        Resolved
                    </span>
                    <span className="text-2xl font-bold text-green-600 mt-1">
                        {tickets.filter((t) => t.status === "resolved").length}
                    </span>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        placeholder="Search tickets by title or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="relative min-w-[150px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter size={18} className="text-gray-400" />
                    </div>
                    <select
                        className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 appearance-none font-medium text-gray-700"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filteredTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                        {searchTerm || statusFilter !== "All" ? (
                            <Search size={28} />
                        ) : (
                            <FileText size={28} />
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {searchTerm || statusFilter !== "All"
                            ? "No tickets match your filters"
                            : "No complaints yet"}
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        {searchTerm || statusFilter !== "All"
                            ? "Try adjusting your search term or status filter to find what you are looking for."
                            : "You haven't submitted any complaints yet. When you do, they'll appear here."}
                    </p>
                    {!(searchTerm || statusFilter !== "All") && (
                        <Link
                            to="/submit"
                            className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Submit First Complaint
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;

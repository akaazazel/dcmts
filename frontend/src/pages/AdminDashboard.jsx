import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import TicketCard from "../components/TicketCard";
import { useAuth } from "../hooks/useAuth";
import { Search, Filter, ShieldCheck, Users, Ticket } from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [staffMembers, setStaffMembers] = useState([]);

    useEffect(() => {
        fetchTickets();
        fetchUsers();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/admin/tickets");
            setTickets(res.data);
        } catch (err) {
            toast.error("Failed to load tickets.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get("/admin/users");
            // Filter for staff to use for assignments later
            setStaffMembers(res.data.filter((u) => u.role === "staff"));
        } catch (err) {
            console.error("Failed to load users:", err);
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Admin Control Panel
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage all system complaints and assign staff
                            members.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex items-center gap-3">
                        <Ticket className="text-gray-400 h-5 w-5" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Total Tickets
                            </p>
                            <p className="font-bold text-gray-900 leading-none mt-1">
                                {tickets.length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex items-center gap-3">
                        <Users className="text-gray-400 h-5 w-5" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                Active Staff
                            </p>
                            <p className="font-bold text-gray-900 leading-none mt-1">
                                {staffMembers.length}
                            </p>
                        </div>
                    </div>
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
                        placeholder="Search all tickets by title or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 min-w-max">
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={18} className="text-gray-400" />
                        </div>
                        <select
                            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 appearance-none font-medium text-gray-700"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="open">Open (Unassigned)</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
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
                        <Search size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        No tickets match your filters
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Try adjusting your search term or status filter to find
                        what you are looking for.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

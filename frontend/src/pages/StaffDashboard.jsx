import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import TicketCard from "../components/TicketCard";
import { useAuth } from "../hooks/useAuth";
import { Search, Filter, Wrench } from "lucide-react";
import toast from "react-hot-toast";

const StaffDashboard = () => {
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
            const res = await apiClient.get("/staff/tickets");
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
        <div className="space-y-8 max-w-6xl mx-auto flex-col h-full">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-md">
                        <Wrench className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-black">
                            Staff Workspace
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Welcome back, {user?.name.split(" ")[0]}. Here are
                            the tickets assigned to your department.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    {/* Quick Stats */}
                    <div className="bg-white px-4 py-2.5 rounded-md border border-gray-200 flex items-center gap-3 shadow-sm hover:border-gray-300 transition-colors">
                        <div>
                            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                                In Progress
                            </p>
                            <p className="font-bold text-black text-lg leading-none mt-1">
                                {
                                    tickets.filter(
                                        (t) => t.status === "in_progress",
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
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
                        placeholder="Search your tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 min-w-max w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto min-w-[150px]">
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
                        <Search size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-1">
                        No tickets match your filters
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto text-sm">
                        Try adjusting your search query or status filter to find
                        what you are looking for.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;

import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import {
    Search,
    Filter,
    User,
    Mail,
    Building,
    BookOpen,
    Calendar,
    Shield,
    UserCircle,
    ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            toast.error("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.department &&
                u.department.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = roleFilter === "All" || u.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-muted-background rounded-full transition-colors text-muted"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            User Management
                        </h1>
                        <p className="text-sm text-muted mt-1">
                            View and manage all registered accounts across the
                            system.
                        </p>
                    </div>
                </div>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm shadow-sm flex items-center gap-2">
                    <UserCircle size={18} />
                    {users.length} Total Users
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-input text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all transition-colors"
                        placeholder="Search by name, email or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                            <Filter size={16} />
                        </div>
                        <select
                            className="block w-full pl-9 pr-8 py-2 border border-border rounded-md text-sm bg-input text-foreground focus:ring-1 focus:ring-primary focus:border-primary appearance-none transition-colors"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            <option value="student">Students</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* User List Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted-background border-b border-border">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">
                                    User
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">
                                    Details
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted text-right">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="hover:bg-muted-background transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {u.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {u.name}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                                                        <Mail size={12} />
                                                        {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight border ${
                                                    u.role === "admin"
                                                        ? "bg-red-500/10 text-red-600 border-red-200/50"
                                                        : u.role === "staff"
                                                          ? "bg-blue-500/10 text-blue-600 border-blue-200/50"
                                                          : "bg-green-500/10 text-green-600 border-green-200/50"
                                                }`}
                                            >
                                                <Shield size={10} />
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {u.department && (
                                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                                        <Building
                                                            size={12}
                                                            className="text-muted"
                                                        />
                                                        {u.department}
                                                    </div>
                                                )}
                                                {u.semester && (
                                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                                        <BookOpen
                                                            size={12}
                                                            className="text-muted"
                                                        />
                                                        {u.semester}
                                                    </div>
                                                )}
                                                {u.age && (
                                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                                        <span className="text-[10px] font-bold text-muted w-4 uppercase">
                                                            Age
                                                        </span>
                                                        {u.age}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                                    <Calendar
                                                        size={12}
                                                        className="text-muted"
                                                    />
                                                    {format(
                                                        new Date(u.created_at),
                                                        "MMM d, yyyy",
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted mt-0.5">
                                                    {format(
                                                        new Date(u.created_at),
                                                        "h:mm a",
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Search className="h-10 w-10 text-muted/30" />
                                            <p className="text-muted font-medium">
                                                No users found matching your
                                                criteria
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;

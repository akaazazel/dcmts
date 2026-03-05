import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import {
    User,
    Mail,
    Building,
    BookOpen,
    Hash,
    Save,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        department: "",
        semester: "",
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                age: user.age || "",
                department: user.department || "",
                semester: user.semester || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const res = await apiClient.put("/auth/profile", {
                name: formData.name,
                age: formData.age ? parseInt(formData.age) : null,
                department: formData.department,
                semester: formData.semester,
            });
            await refreshUser();
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.detail || "Failed to update profile.",
            );
        } finally {
            setUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-black">
                            Profile Settings
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your personal information and preferences.
                        </p>
                    </div>
                </div>
                <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {user.role}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Account Overview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-black flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            Account Information
                        </h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Static Info */}
                        <div className="flex items-center gap-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100/50">
                            <div className="bg-white p-3 rounded-full shadow-sm border border-blue-100 text-blue-600">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                                    Registered Email
                                </p>
                                <p className="text-base font-semibold text-black">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white transition-all text-gray-900 font-medium"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                {/* Age */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Age
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Hash size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white transition-all text-gray-900 font-medium"
                                            placeholder="Your age"
                                        />
                                    </div>
                                </div>

                                {/* Department */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Department
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Building size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white transition-all text-gray-900 font-medium"
                                            placeholder="e.g. Computer Science"
                                        />
                                    </div>
                                </div>

                                {/* Semester */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Semester / Term
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <BookOpen size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white transition-all text-gray-900 font-medium"
                                            placeholder="e.g. 5th Semester"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-md hover:bg-gray-800 transition-all font-medium text-sm shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {updating ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

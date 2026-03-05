import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import { Send, FileText, Tag, AlertCircle } from "lucide-react";

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "IT Support", // Default category
        priority: "Medium",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            toast.error("Please provide a title and description.");
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.post("/tickets/create", formData);
            toast.success("Complaint submitted successfully!");
            navigate("/dashboard"); // Go back to dashboard to see the ticket
        } catch (err) {
            toast.error(
                err.response?.data?.detail || "Failed to submit complaint.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 mb-1">
                        <FileText className="h-5 w-5 text-gray-400" />
                        Submit a Complaint
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Provide the details to help us resolve your issue
                        quickly.
                    </p>
                </div>

                {/* Form Body */}
                <div className="px-6 py-6 sm:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-6">
                            {/* Title Field */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white shadow-sm placeholder:text-gray-400"
                                    placeholder="Brief summary of the issue"
                                />
                            </div>

                            {/* Category Field */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5"
                                >
                                    <Tag className="h-3.5 w-3.5 text-gray-400" />
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors appearance-none bg-white shadow-sm"
                                    >
                                        <option value="IT Support">
                                            IT Support
                                        </option>
                                        <option value="Facilities">
                                            Facilities Maintenance
                                        </option>
                                        <option value="Hostel">
                                            Hostel/Accommodation
                                        </option>
                                        <option value="Library">Library</option>
                                        <option value="Other">Other</option>
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

                            {/* Priority Field */}
                            <div>
                                <label
                                    htmlFor="priority"
                                    className="block text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5"
                                >
                                    <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                                    Priority
                                </label>
                                <div className="relative">
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors appearance-none bg-white shadow-sm"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
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

                            {/* Description Field */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors shadow-sm resize-y"
                                    placeholder="Provide detailed information including location or timing if relevant..."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center items-center gap-2 rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Ticket</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitComplaint;

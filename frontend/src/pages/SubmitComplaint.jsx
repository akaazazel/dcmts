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
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-primary px-6 py-8 sm:p-10 text-white">
                    <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        <FileText className="h-8 w-8 text-white/90" />
                        Submit a Complaint
                    </h2>
                    <p className="text-primary-100 text-sm max-w-xl">
                        Please provide details about the issue you are facing.
                        We will assign the appropriate staff to help resolve it
                        as soon as possible.
                    </p>
                </div>

                {/* Form Body */}
                <div className="px-6 py-8 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                            {/* Title Field */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Complaint Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow"
                                        placeholder="Briefly describe the issue"
                                    />
                                </div>
                            </div>

                            {/* Category Field */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-semibold text-gray-700 flex items-center gap-1"
                                >
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    Category
                                </label>
                                <div className="mt-2 relative">
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-3 pl-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none bg-white"
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
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Priority Field */}
                            <div>
                                <label
                                    htmlFor="priority"
                                    className="block text-sm font-semibold text-gray-700 flex items-center gap-1"
                                >
                                    <AlertCircle className="h-4 w-4 text-gray-400" />
                                    Priority
                                </label>
                                <div className="mt-2 relative">
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-3 pl-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 appearance-none bg-white"
                                    >
                                        <option value="Low">
                                            Low - Not Urgent
                                        </option>
                                        <option value="Medium">
                                            Medium - Needs Attention
                                        </option>
                                        <option value="High">
                                            High - Urgent
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-semibold text-gray-700"
                                >
                                    Detailed Description
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow resize-y"
                                        placeholder="Provide as much detail as possible about the issue..."
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Please include location, timings, and any
                                    other relevant context.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed transition"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit Complaint
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

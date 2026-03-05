import React from "react";

export const StatusBadge = ({ status }) => {
    let classes = "bg-gray-50 text-gray-600 border border-gray-200";

    switch (status?.toLowerCase()) {
        case "open":
            classes = "bg-blue-50 text-blue-700 border border-blue-200";
            break;
        case "in_progress":
            classes = "bg-yellow-50 text-yellow-700 border border-yellow-200";
            break;
        case "resolved":
            classes = "bg-green-50 text-green-700 border border-green-200";
            break;
        case "closed":
            classes = "bg-gray-50 text-gray-600 border border-gray-200";
            break;
        default:
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-medium tracking-wide ${classes}`}
        >
            {status ? status.replace("_", " ").toUpperCase() : "UNKNOWN"}
        </span>
    );
};

export const PriorityBadge = ({ priority }) => {
    let classes = "bg-gray-50 text-gray-600 border border-gray-200";

    switch (priority?.toLowerCase()) {
        case "low":
            classes = "bg-green-50 text-green-700 border border-green-200";
            break;
        case "medium":
            classes = "bg-orange-50 text-orange-700 border border-orange-200";
            break;
        case "high":
            classes = "bg-red-50 text-red-700 border border-red-200";
            break;
        default:
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-medium tracking-wide ${classes}`}
        >
            {priority ? priority.toUpperCase() : "UNKNOWN"}
        </span>
    );
};

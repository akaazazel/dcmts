import React from "react";

export const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";

    switch (status?.toLowerCase()) {
        case "open":
            bgColor = "bg-blue-100";
            textColor = "text-blue-800";
            break;
        case "in_progress":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
        case "resolved":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
        case "closed":
            bgColor = "bg-gray-200";
            textColor = "text-gray-600";
            break;
        default:
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
        >
            {status ? status.replace("_", " ").toUpperCase() : "UNKNOWN"}
        </span>
    );
};

export const PriorityBadge = ({ priority }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";

    switch (priority?.toLowerCase()) {
        case "low":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
        case "medium":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
        case "high":
            bgColor = "bg-red-100";
            textColor = "text-red-800";
            break;
        default:
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
        >
            {priority ? priority.toUpperCase() : "UNKNOWN"}
        </span>
    );
};

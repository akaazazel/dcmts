import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { MessageSquare, Calendar, ChevronRight } from "lucide-react";

const TicketCard = ({ ticket, linkPrefix = "/tickets" }) => {
    return (
        <Link
            to={`${linkPrefix}/${ticket.id}`}
            className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
        >
            <div className="p-5 sm:p-6">
                <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {ticket.ticket_id}
                            </span>
                            <PriorityBadge priority={ticket.priority} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {ticket.title}
                        </h3>
                    </div>
                    <StatusBadge status={ticket.status} />
                </div>

                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {ticket.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            {ticket.category}
                        </div>
                        <div
                            className="flex items-center gap-1.5"
                            title="Date created"
                        >
                            <Calendar size={14} className="text-gray-400" />
                            {ticket.created_at
                                ? format(
                                      new Date(ticket.created_at),
                                      "MMM d, yyyy",
                                  )
                                : "Recently"}
                        </div>
                    </div>

                    <div className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all flex items-center text-sm font-semibold">
                        View Details
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TicketCard;

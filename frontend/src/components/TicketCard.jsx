import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { Calendar, ArrowRight } from "lucide-react";

const TicketCard = ({ ticket, linkPrefix = "/tickets" }) => {
    return (
        <Link
            to={`${linkPrefix}/${ticket.id}`}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden group"
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-3 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[11px] font-mono font-medium text-gray-500 bg-gray-100/80 px-1.5 py-0.5 rounded border border-gray-200 tracking-wide">
                                {ticket.ticket_id}
                            </span>
                            <PriorityBadge priority={ticket.priority} />
                        </div>
                        <h3 className="text-base font-semibold text-black group-hover:text-gray-600 transition-colors line-clamp-1">
                            {ticket.title}
                        </h3>
                    </div>
                    <StatusBadge status={ticket.status} />
                </div>

                <p className="text-sm text-gray-500 mb-5 line-clamp-2 pr-4 leading-relaxed">
                    {ticket.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {ticket.category}
                        </div>
                        <div
                            className="flex items-center gap-1.5"
                            title="Date created"
                        >
                            <Calendar size={13} className="text-gray-400" />
                            {ticket.created_at
                                ? format(
                                      new Date(ticket.created_at),
                                      "MMM d, yyyy",
                                  )
                                : "Recently"}
                        </div>
                    </div>

                    <div className="text-gray-800 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all flex items-center text-sm font-medium">
                        View
                        <ArrowRight size={14} className="ml-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TicketCard;

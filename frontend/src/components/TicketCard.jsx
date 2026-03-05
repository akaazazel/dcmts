import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { Calendar, ArrowRight, Check } from "lucide-react";

const TicketCard = ({
    ticket,
    linkPrefix = "/tickets",
    onSelect,
    isSelected,
}) => {
    return (
        <div className="relative group h-full">
            {onSelect && (
                <button
                    className={`absolute top-3 left-3 z-20 p-1 rounded-full transition-all duration-200 ${
                        isSelected
                            ? "bg-primary text-white scale-110 shadow-md"
                            : "bg-card text-muted opacity-0 group-hover:opacity-100 border border-border hover:border-primary hover:text-primary shadow-sm"
                    }`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelect(ticket.id);
                    }}
                    title={isSelected ? "Deselect ticket" : "Select ticket"}
                >
                    <Check size={14} strokeWidth={3} />
                </button>
            )}
            <Link
                to={`${linkPrefix}/${ticket.id}`}
                className={`flex flex-col h-full rounded-xl transition-all duration-300 ${
                    isSelected
                        ? "bg-primary/[0.03] border-2 border-primary shadow-md ring-4 ring-primary/5 translate-y-[-2px]"
                        : "bg-card border border-border hover:border-primary/20 hover:shadow-md"
                }`}
            >
                <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3 gap-4">
                        <div
                            className={`${onSelect ? "pl-6" : ""} transition-all duration-300`}
                        >
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="text-[11px] font-mono font-medium text-muted bg-muted-background px-1.5 py-0.5 rounded border border-border tracking-wide">
                                    {ticket.ticket_id}
                                </span>
                                <PriorityBadge priority={ticket.priority} />
                            </div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {ticket.title}
                            </h3>
                        </div>
                        <StatusBadge status={ticket.status} />
                    </div>

                    <p className="text-sm text-muted mb-5 line-clamp-2 pr-4 leading-relaxed">
                        {ticket.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-foreground bg-muted-background px-2 py-1 rounded-md border border-border">
                                {ticket.category}
                            </div>
                            <div
                                className="flex items-center gap-1.5 text-muted"
                                title="Date created"
                            >
                                <Calendar size={13} />
                                {ticket.created_at
                                    ? format(
                                          new Date(ticket.created_at),
                                          "MMM d, yyyy",
                                      )
                                    : "Recently"}
                            </div>
                        </div>

                        <div className="text-foreground opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all flex items-center text-sm font-medium">
                            View
                            <ArrowRight size={14} className="ml-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default TicketCard;

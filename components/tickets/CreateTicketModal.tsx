"use client";

import { useState } from "react";
import CustomModal from "@/components/shared/Modal";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Dropdown from "@/components/shared/Dropdown";
import type { DropdownItem } from "@/components/shared/Dropdown";
import { TICKET_PRIORITIES } from "@/features/tickets/constants";
import { getPriorityConfig } from "@/features/tickets/utils";
import type { TicketPriority } from "@/types";

const PRIORITY_ITEMS: DropdownItem[] = TICKET_PRIORITIES.map((p) => ({
  label: getPriorityConfig(p).label,
  value: p,
}));

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");

  const handleClose = () => {
    setSubject("");
    setDescription("");
    setPriority("medium");
    onClose();
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={handleClose}
      loading={false}
      width={600}
      headerContent={
        <div>
          <h2 className="text-lg font-semibold text-foreground">Create New Ticket</h2>
          <p className="mt-0.5 text-sm text-foreground/70">Submit a support request</p>
        </div>
      }
      bodyContent={
        <form onSubmit={(e) => e.preventDefault()} className="px-6 py-4 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Subject <span className="text-error">*</span>
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the problem..."
              rows={5}
              className="w-full rounded-[10px] border border-border bg-input-bg px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-ring resize-none hover:border-border-hover transition-smooth"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Priority <span className="text-error">*</span>
            </label>
            <Dropdown
              items={PRIORITY_ITEMS}
              value={priority}
              onChange={(v) => setPriority(v as TicketPriority)}
              placeholder="Select priority"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="free-sm" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" size="free-sm" type="submit">
              Submit Ticket
            </Button>
          </div>
        </form>
      }
    />
  );
}
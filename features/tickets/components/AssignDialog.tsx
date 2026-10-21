'use client';

import { useState } from 'react';
import CustomModal from '@/components/shared/Modal';
import Dropdown from '@/components/shared/Dropdown';
import Button from '@/components/shared/Button';
import type { DropdownItem } from '@/components/shared/Dropdown';
import type { User, Ticket } from '@/types';

interface AssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  activeAgents: User[];
  onAssign: (agent: { id: number; name: string }) => Promise<void>;
}

export default function AssignDialog({
  isOpen,
  onClose,
  ticket,
  activeAgents,
  onAssign,
}: AssignDialogProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    ticket.agent ? String(ticket.agent.id) : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const agentItems: DropdownItem[] = activeAgents.map((agent) => ({
    label: `${agent.name} (${agent.email})`,
    value: String(agent.id),
  }));

  const handleAssign = async () => {
    const targetAgent = activeAgents.find((a) => String(a.id) === selectedAgentId);
    if (!targetAgent) return;

    try {
      setSubmitting(true);
      await onAssign({ id: targetAgent.id, name: targetAgent.name });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      loading={false}
      width={480}
      headerContent={
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {ticket.agent ? 'Reassign Ticket' : 'Assign Ticket'}
          </h2>
          <p className="mt-0.5 text-xs text-foreground-muted truncate">
            Ticket #{ticket.id}: {ticket.subject}
          </p>
        </div>
      }
      bodyContent={
        <div className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground-secondary">
              Select Active Agent
            </label>
            <Dropdown
              items={agentItems}
              value={selectedAgentId}
              onChange={setSelectedAgentId}
              placeholder="Choose an agent..."
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              variant="secondary"
              size="free-sm"
              className="h-[40px] min-w-0 w-auto px-4 rounded-lg text-sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="free-sm"
              className="h-[40px] min-w-0 w-auto px-5 rounded-lg text-sm"
              onClick={handleAssign}
              disabled={!selectedAgentId || submitting}
              isLoading={submitting}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      }
    />
  );
}

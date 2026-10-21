import { AlertCircle, Clock } from 'lucide-react';
import type { UserRole } from '@/types';

interface WaitingBannerProps {
  role: UserRole;
}

export default function WaitingBanner({ role }: WaitingBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#8E24AA]/30 bg-[#F3E5F5]/60 p-4 text-[#4A148C]">
      <Clock className="size-5 shrink-0 text-[#8E24AA] mt-0.5" />
      <div className="text-sm">
        <p className="font-semibold">
          {role === 'customer'
            ? 'Action Needed: The support team is waiting for your response'
            : 'Ticket is currently waiting for customer feedback'}
        </p>
        <p className="mt-0.5 text-xs text-[#6A1B9A]">
          {role === 'customer'
            ? 'Replying below will automatically mark this ticket as In Progress and alert your assigned agent.'
            : 'When the customer submits a reply, the status will automatically return to In Progress.'}
        </p>
      </div>
    </div>
  );
}

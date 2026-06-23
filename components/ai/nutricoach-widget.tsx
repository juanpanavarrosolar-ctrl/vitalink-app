'use client';

import { ChatWidget } from './chat-widget';
import { NUTRICOACH_CTAS } from '@/lib/agents/nutricoach-pro';

interface NutriCoachWidgetProps {
  patientId?: string;
  planId?: string;
}

export function NutriCoachWidget({ patientId, planId }: NutriCoachWidgetProps) {
  return (
    <ChatWidget
      agentName="NutriCoach Pro"
      agentEmoji="🧬"
      tagline="Tu asistente clínico de nutrición"
      endpoint="/api/chat/nutricoach"
      ctas={NUTRICOACH_CTAS}
      extraBody={{ patientId, planId }}
      accentClass="bg-emerald-700"
    />
  );
}

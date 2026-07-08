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
      agentName="VitaCoach Pro"
      agentEmoji="🧬"
      tagline="Tu asistente clínico de suplementación"
      endpoint="/api/chat/nutricoach"
      ctas={NUTRICOACH_CTAS}
      extraBody={{ patientId, planId }}
      accentClass="bg-emerald-700"
    />
  );
}

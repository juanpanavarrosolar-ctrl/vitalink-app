'use client';

import { ChatWidget } from './chat-widget';
import { NUTRIGUIA_CTAS } from '@/lib/agents/nutriguia';

interface NutriGuiaWidgetProps {
  planToken?: string;
}

export function NutriGuiaWidget({ planToken }: NutriGuiaWidgetProps) {
  return (
    <ChatWidget
      agentName="VitaGuía"
      agentEmoji="🌿"
      tagline="Tu guía de bienestar personalizado"
      endpoint="/api/chat/nutriguia"
      ctas={NUTRIGUIA_CTAS}
      extraBody={planToken ? { planToken } : {}}
      accentClass="bg-teal-600"
    />
  );
}

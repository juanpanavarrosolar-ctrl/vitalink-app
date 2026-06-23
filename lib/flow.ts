import { createHmac } from 'crypto';

const BASE_URL = process.env.FLOW_API_URL ?? 'https://sandbox.flow.cl/api';
const API_KEY = process.env.FLOW_API_KEY!;
const SECRET = process.env.FLOW_SECRET_KEY!;

function sign(params: Record<string, string>): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce<Record<string, string>>((acc, k) => { acc[k] = params[k]; return acc; }, {});
  const toSign = Object.entries(sorted).map(([k, v]) => `${k}${v}`).join('');
  return createHmac('sha256', SECRET).update(toSign).digest('hex');
}

async function flowRequest(path: string, params: Record<string, string>): Promise<any> {
  const allParams: Record<string, string> = { ...params, apiKey: API_KEY };
  allParams.s = sign(allParams);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(allParams).toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Flow API error ${res.status}: ${text}`);
  }
  return res.json();
}

export interface FlowPaymentRequest {
  commerceOrder: string;
  subject: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
}

export interface FlowPaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
}

export async function createFlowPayment(req: FlowPaymentRequest): Promise<FlowPaymentResponse> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const data = await flowRequest('/payment/create', {
    commerceOrder: req.commerceOrder,
    subject: req.subject,
    amount: String(req.amount),
    email: req.email,
    urlConfirmation: req.urlConfirmation.startsWith('http') ? req.urlConfirmation : `${appUrl}${req.urlConfirmation}`,
    urlReturn: req.urlReturn.startsWith('http') ? req.urlReturn : `${appUrl}${req.urlReturn}`,
    currency: 'CLP',
    paymentMethod: '9',
  });
  return { url: `${data.url}?token=${data.token}`, token: data.token, flowOrder: data.flowOrder };
}

export async function getFlowPaymentStatus(token: string): Promise<any> {
  const params = { token, apiKey: API_KEY };
  const paramsWithSig = { ...params, s: sign(params) };
  const qs = new URLSearchParams(paramsWithSig).toString();
  const res = await fetch(`${BASE_URL}/payment/getStatus?${qs}`);
  if (!res.ok) throw new Error(`Flow getStatus error ${res.status}`);
  return res.json();
}

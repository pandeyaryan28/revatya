/**
 * Guild Orbit Inbound Channel Webhook Service
 * Routes leads, partner inquiries, and contributor interest directly
 * to the team's Guild Orbit chat channel and operational inbox.
 */

export interface GuildOrbitLeadPayload {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  createTask?: boolean;
  metadata?: Record<string, unknown>;
}

export interface GuildOrbitLeadResponse {
  success: boolean;
  messageId?: string;
  taskId?: string;
  error?: string;
}

export const GUILD_ORBIT_WEBHOOK_URL =
  'https://app.guildorbit.com/api/webhooks/channel?channelId=f1dJrhhCql85nk11P7a6&token=gh_live_2b52700cd78cf54aec18658353077be9de4232201ba0ef9e3bff04f2dd542cd6';

export async function sendGuildOrbitLead(
  payload: GuildOrbitLeadPayload
): Promise<GuildOrbitLeadResponse> {
  const webhookUrl =
    (typeof import.meta !== 'undefined' &&
      import.meta.env?.VITE_GUILD_ORBIT_WEBHOOK_URL) ||
    GUILD_ORBIT_WEBHOOK_URL;

  let timeoutId: any;
  let signal: AbortSignal | undefined;

  if (typeof AbortController !== 'undefined') {
    try {
      const controller = new AbortController();
      signal = controller.signal;
      timeoutId = setTimeout(() => controller.abort(), 8000);
    } catch {
      // Ignore controller instantiation issues in test environments
    }
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        createTask: payload.createTask ?? true,
      }),
      ...(signal ? { signal } : {}),
    });

    if (timeoutId) clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data?.error || `HTTP ${res.status}: Failed to deliver lead to Guild Orbit`,
      };
    }

    return {
      success: true,
      messageId: data.messageId,
      taskId: data.taskId,
    };
  } catch (err: unknown) {
    if (timeoutId) clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[Guild Orbit Webhook] Delivery notice:', message);
    return {
      success: false,
      error: message || 'Network error reaching Guild Orbit webhook',
    };
  }
}

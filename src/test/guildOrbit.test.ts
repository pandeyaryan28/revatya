import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendGuildOrbitLead, GUILD_ORBIT_WEBHOOK_URL } from '../lib/guildOrbit';

describe('guildOrbit webhook client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('delivers a lead payload with proper schema and createTask flag', async () => {
    let capturedUrl = '';
    let capturedBody: any = null;

    global.fetch = vi.fn().mockImplementation(async (url, init) => {
      capturedUrl = url;
      capturedBody = JSON.parse(init.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          messageId: 'msg_test_123',
          taskId: 'task_test_456',
        }),
      };
    });

    const res = await sendGuildOrbitLead({
      name: 'Elena Rostova',
      email: 'elena@orbital.space',
      subject: 'Partnership Inquiry: ECLSS',
      message: 'Interested in closed-loop life support collaboration.',
      metadata: {
        originatingPage: 'Partners Page',
        category: 'Technical or research collaboration',
      },
    });

    expect(capturedUrl).toBe(GUILD_ORBIT_WEBHOOK_URL);
    expect(capturedBody.name).toBe('Elena Rostova');
    expect(capturedBody.email).toBe('elena@orbital.space');
    expect(capturedBody.createTask).toBe(true);
    expect(capturedBody.metadata.originatingPage).toBe('Partners Page');

    expect(res.success).toBe(true);
    expect(res.messageId).toBe('msg_test_123');
    expect(res.taskId).toBe('task_test_456');
  });

  it('gracefully handles network failures without throwing uncaught exceptions', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Connection timeout'));

    const res = await sendGuildOrbitLead({
      name: 'Network Test',
      message: 'Testing network failure tolerance.',
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain('Connection timeout');
  });

  it('handles non-200 HTTP responses gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Validation failed: "name" is required' }),
    });

    const res = await sendGuildOrbitLead({
      name: '',
      message: 'Bad payload',
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain('Validation failed');
  });
});

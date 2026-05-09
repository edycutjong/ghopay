import { describe, it, expect, vi } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown) => ({ json: () => data, body: data }),
  },
}));

describe('GET /api/health', () => {
  it('returns status ok with required fields', async () => {
    const { GET } = await import('./route');
    const response = await GET();
    const body = (response as unknown as { body: Record<string, unknown> }).body;

    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
    expect(new Date(body.timestamp as string).toISOString()).toBe(body.timestamp);
    expect(typeof body.uptime).toBe('number');
    expect(body.uptime).toBeGreaterThanOrEqual(0);
  });

  it('includes the NODE_ENV', async () => {
    const { GET } = await import('./route');
    const response = await GET();
    const body = (response as unknown as { body: Record<string, unknown> }).body;

    expect(body).toHaveProperty('environment');
  });
});

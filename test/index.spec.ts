import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('worker', () => {
	it('2 + 2 equals 4', async () => {
		expect(2 + 2).toBe(4);
	});
});

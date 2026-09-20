import { describe, expect, it } from 'vitest';
import { logProductivitySchema } from './log-productivity.schema.js';

describe('logProductivitySchema', () => {
  it('accepts a percentage from 0.01 to 1', () => {
    expect(logProductivitySchema.parse({ percentage: 0.01 })).toEqual({
      percentage: 0.01,
    });
    expect(logProductivitySchema.parse({ percentage: 0.1 })).toEqual({
      percentage: 0.1,
    });
    expect(logProductivitySchema.parse({ percentage: 0.55 })).toEqual({
      percentage: 0.55,
    });
    expect(logProductivitySchema.parse({ percentage: 1 })).toEqual({
      percentage: 1,
    });
  });

  it.each([0, 0.005, 1.01])(
    'rejects an invalid percentage: %s',
    (percentage) => {
      expect(() => logProductivitySchema.parse({ percentage })).toThrow();
    },
  );
});

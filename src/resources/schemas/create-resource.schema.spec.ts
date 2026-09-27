import { describe, expect, it } from 'vitest';
import { createResourceSchema } from './create-resource.schema.js';

describe('createResourceSchema', () => {
  it.each(['YOUTUBE', 'BOOK', 'PDF', 'WEBSITE', 'OTHER'])(
    'accepts %s with only required fields and trims the title',
    (type) => {
      expect(createResourceSchema.parse({ title: ' Material ', type })).toEqual(
        {
          title: 'Material',
          type,
        },
      );
    },
  );

  it('accepts optional URL and description', () => {
    const data = {
      title: 'Lesson',
      type: 'YOUTUBE',
      url: 'https://youtube.com/watch?v=lesson',
      description: 'Conditionals and loops',
    };
    expect(createResourceSchema.parse(data)).toEqual(data);
  });

  it.each([
    {},
    null,
    [],
    { type: 'BOOK' },
    { title: 'Book' },
    { title: '', type: 'BOOK' },
    { title: '   ', type: 'BOOK' },
    { title: 123, type: 'BOOK' },
    { title: 'Book', type: 'INVALID' },
    { title: 'Book', type: 'book' },
    { title: 'Book', type: 'BOOK', url: 'invalid-url' },
    { title: 'Book', type: 'BOOK', url: null },
    { title: 'Book', type: 'BOOK', description: 123 },
    { title: 'Book', type: 'BOOK', userId: 'another-user' },
    { title: 'Book', type: 'BOOK', taskId: 'another-task' },
  ])('rejects invalid input: %j', (body) => {
    expect(createResourceSchema.safeParse(body).success).toBe(false);
  });
});

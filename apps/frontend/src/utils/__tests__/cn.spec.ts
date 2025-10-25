import { cn } from '../cn';

describe('cn', () => {
  it('returns a single class', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('merges multiple classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const condition = false;

    expect(cn('foo', condition && 'bar', undefined, null, 'baz')).toBe(
      'foo baz'
    );
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });
});

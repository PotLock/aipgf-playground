import { getShortName } from '../string.util';

it('should return the initials of a name with one word', () => {
  const name = 'John';

  const result = getShortName(name);

  expect(result).toBe('J');
});

it('should return the initials of a name with multiple words', () => {
  const name = 'John Doe';

  const result = getShortName(name);

  expect(result).toBe('JD');
});

it('should return first 2 world if a name more than 2 words', () => {
  const name = 'John Doe Smith';

  const result = getShortName(name);

  expect(result).toBe('JD');
});

it("should return 'A' when no name is provided", () => {
  const result = getShortName();

  expect(result).toBe('A');
});

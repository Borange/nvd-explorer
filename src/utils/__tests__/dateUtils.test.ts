import { formatDateString } from '@/utils/dateUtils';

describe('formatIsoDate', () => {
  test('Should convert date', () => {
    expect(formatDateString('2025-05-18T01:20:52.754')).toEqual('2025-05-18');
    expect(formatDateString('1970-01-01T00:00:00Z')).toEqual('1970-01-01');
  });

  test.each(['test', null, undefined, 0, {}])(
    'Handle invalid dates',
    (value) => {
      expect(formatDateString(value as string)).toEqual('-');
    },
  );
});

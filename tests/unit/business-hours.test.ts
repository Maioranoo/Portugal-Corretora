import { describe, expect, test } from 'vitest';
import { isWithinBusinessHours } from '../../src/lib/business-hours';

// 2026-09-28 é segunda-feira; 2026-10-02 é sexta; 2026-10-03 é sábado; 2026-10-04 é domingo.
describe('isWithinBusinessHours (America/Sao_Paulo, seg–sex 8h–20h)', () => {
  test.each([
    ['2026-09-28T12:00:00-03:00', true],
    ['2026-09-28T07:59:00-03:00', false],
    ['2026-09-28T08:00:00-03:00', true],
    ['2026-09-28T19:59:00-03:00', true],
    ['2026-09-28T20:00:00-03:00', false],
    ['2026-10-02T19:30:00-03:00', true],
    ['2026-10-02T20:30:00-03:00', false],
    ['2026-10-03T10:00:00-03:00', false],
    ['2026-10-04T10:00:00-03:00', false],
    ['2026-09-28T22:30:00Z', true],  // 19h30 em São Paulo
    ['2026-09-28T23:00:00Z', false], // 20h00 em São Paulo
    ['2026-09-29T02:00:00+09:00', true],  // visitante no Japão (terça 2h lá) = segunda 14h em SP: vale o fuso de SP
  ])('%s → %s', (iso, expected) => {
    expect(isWithinBusinessHours(new Date(iso))).toBe(expected);
  });
});

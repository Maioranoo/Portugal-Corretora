import { describe, expect, test } from 'vitest';
import { formatBrPhone, maskBrPhoneInput, normalizeBrPhone } from '../../src/lib/phone';

describe('normalizeBrPhone', () => {
  test.each([
    ['(11) 98765-4321', '11987654321'],
    ['11987654321', '11987654321'],
    ['+55 11 98765-4321', '11987654321'],
    ['5511987654321', '11987654321'],
    ['011987654321', '11987654321'],
    ['  11 9 8765 4321 ', '11987654321'],
    ['(11) 3456-7890', '1134567890'],
    ['551134567890', '1134567890'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeBrPhone(input)).toBe(expected);
  });

  test.each([
    [''],
    ['abc'],
    ['987654321'],      // sem DDD
    ['00987654321'],    // DDD inválido
    ['10987654321'],    // DDD inválido (segundo dígito 0)
    ['11887654321'],    // 11 dígitos sem o 9 inicial
    ['119876543210'],   // dígitos demais
  ])('%s é inválido', (input) => {
    expect(normalizeBrPhone(input)).toBeNull();
  });
});

describe('formatBrPhone', () => {
  test('celular', () => expect(formatBrPhone('11987654321')).toBe('(11) 98765-4321'));
  test('fixo', () => expect(formatBrPhone('1134567890')).toBe('(11) 3456-7890'));
});

describe('maskBrPhoneInput', () => {
  test.each([
    ['', ''],
    ['1', '(1'],
    ['11', '(11'],
    ['119', '(11) 9'],
    ['1198765', '(11) 9876-5'],
    ['1134567890', '(11) 3456-7890'],
    ['11987654321', '(11) 98765-4321'],
    ['119876543219999', '(11) 98765-4321'],
    ['(11) 98765-4321', '(11) 98765-4321'],
    ['+55 11 98765-4321', '(11) 98765-4321'], // colado com código do país
    ['5511987654321', '(11) 98765-4321'],
    ['011987654321', '(11) 98765-4321'], // com zero de operadora
    ['+55 11 3456-7890', '(11) 3456-7890'],
  ])('%s → %s', (raw, expected) => {
    expect(maskBrPhoneInput(raw)).toBe(expected);
  });
});

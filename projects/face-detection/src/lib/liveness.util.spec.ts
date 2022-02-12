import { filterActions, isFacingActionByDistance } from './liveness.util';

describe('liveness.util', () => {
  it('filterActions', () => {
    const result = filterActions(
      [{ facingLeft: true }, { facingLeft: true }, { facingCamera: true }, { facingRight: true }],
      ['facingLeft', 'facingRight']
    );
    expect(result).toEqual(['facingLeft', 'facingRight']);
  });

  it('isFacingActionByDistance', () => {
    const result = isFacingActionByDistance(
      ['facingLeft', 'facingCamera', 'facingRight', 'facingCamera', 'facingLeft', 'facingRight'],
      'facingLeft',
      'facingRight',
      2
    );
    expect(result).toEqual(true);
  });
  it('isFacingActionByDistance', () => {
    const result = isFacingActionByDistance(
      ['facingLeft', 'facingCamera', 'facingRight', 'facingCamera', 'facingLeft', 'facingCamera', 'facingRight'],
      'facingLeft',
      'facingRight',
      2
    );
    expect(result).toEqual(true);
  });
});

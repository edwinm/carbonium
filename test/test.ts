import * as assert from 'assert';
import { $ } from '../src/miq';

describe('$', () => {
  beforeEach(() => {
    document.body.textContent = '';
    for (let i = 0; i < 6; i++) {
      const div = document.createElement('div');
      div.textContent = `item${i}`;
      document.body.appendChild(div);
    }
  });

  it('textContent', () => {
    $('div:first-child').textContent = 'hello';
    assert.equal($('div:first-child').textContent, 'hello');
  });
});

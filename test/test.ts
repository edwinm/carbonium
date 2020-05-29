import * as assert from 'assert';
import { $ } from '../src/miq';

/**
 * Test framework used:
 * Mocha https://mochajs.org/
 * Assert https://nodejs.org/api/assert.html
 */


describe('$', () => {
  beforeEach(() => {
    document.body.textContent = '';
    for (let i = 0; i < 6; i++) {
      const div = document.createElement('div');
      div.textContent = `item${i}`;
      document.body.appendChild(div);
    }
  });

  it('textContent one element', () => {
    $('div:first-child').textContent = 'hello';
    const divs = document.getElementsByTagName('div');
    assert.equal(divs[0].textContent, 'hello');
  });

  it('textContent all elements', () => {
    $('div').textContent = 'hello';
    assert.equal(document.body.textContent, 'hellohellohellohellohellohello');
  });

  it('setAttribute all elements', () => {
    $('div').setAttribute('aria-label', 'List item');
    const divs = document.getElementsByTagName('div');
    assert.equal(divs[0].getAttribute('aria-label'), 'List item');
    assert.equal(divs[1].getAttribute('aria-label'), 'List item');
    assert.equal(divs[5].getAttribute('aria-label'), 'List item');
  });

  it('filter', () => {
    $('div')
      .filter((el) => el.textContent == 'item1')
      .textContent = 'hello';
    assert.equal(document.body.textContent, 'item0helloitem2item3item4item5');
  });

  it('class add method', () => {
    $('div').classList.add('some-class');
    const divs = document.getElementsByTagName('div');
    assert.ok(divs[0].classList.contains('some-class'));
    assert.ok(divs[5].classList.contains('some-class'));
  });

  it('class value property', () => {
    $('div').classList.add('some-class');
    const divs = document.getElementsByTagName('div');
    assert.equal(divs[0].classList.value, 'some-class');
  });

  it('class add method and textContent property', () => {
    $('div:first-child').classList.add('some-class').textContent = 'hello';
    const divs = document.getElementsByTagName('div');
    assert.ok(divs[0].classList.contains('some-class'));
    assert.ok(!divs[5].classList.contains('some-class'));
    assert.equal(divs[0].textContent, 'hello');
    assert.equal(divs[5].textContent, 'item5');
  });

  it('filter and class add method and textContent property', () => {
    $('div').filter((el) => el.textContent == 'item0').classList.add('some-class').textContent = 'hello';
    const divs = document.getElementsByTagName('div');
    assert.ok(divs[0].classList.contains('some-class'));
    assert.ok(!divs[5].classList.contains('some-class'));
    assert.equal(divs[0].textContent, 'hello');
    assert.equal(divs[5].textContent, 'item5');
  });

  it('combined', () => {
    $('div')
      .forEach((el) => el.title = `A div with content ${el.textContent}`)
      .setAttribute('aria-label', 'List item')
      .filter((el) => el.textContent == 'item1')
      .textContent = 'hello';
    const divs = document.getElementsByTagName('div');
    assert.equal(divs[0].getAttribute('aria-label'), 'List item');
    assert.equal(divs[5].getAttribute('aria-label'), 'List item');
    assert.equal(divs[0].getAttribute('title'), 'A div with content item0');
    assert.equal(divs[5].getAttribute('title'), 'A div with content item5');
    assert.equal(document.body.textContent, 'item0helloitem2item3item4item5');
  });

  it('textContent empty list', () => {
    assert.doesNotThrow(() => {
      $('div.non-existent').textContent = 'hello';
    });
  });

  it('setAttribute empty list', () => {
    assert.doesNotThrow(() => {
      $('div.non-existent').setAttribute('aria-label', 'List item');
    });
  });

  it('call element specific function', () => {
    const input = document.createElement('input');
    document.querySelector('div:first-child').appendChild(input);
    assert.doesNotThrow(() => {
      $('input').select();
    });
  });

});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';

let intersectionCallback: IntersectionObserverCallback;

class TestIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds: readonly number[] = [];

  disconnect = jest.fn();
  observe = jest.fn();
  takeRecords = jest.fn().mockReturnValue([]);
  unobserve = jest.fn();

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }
}

@Component({
  standalone: true,
  imports: [InfiniteScrollDirective],
  template: `<div appInfiniteScroll [disabled]="disabled" (scrolled)="onScrolled()"></div>`,
})
class HostComponent {
  disabled = false;
  onScrolled = jest.fn();
}

describe('InfiniteScrollDirective', () => {
  configureTestSuite(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: TestIntersectionObserver,
    });

    TestBed.configureTestingModule({
      imports: [HostComponent],
    });
  });

  function setup() {
    const fixture: ComponentFixture<HostComponent> = TestBed.createComponent(HostComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    return { fixture, component };
  }

  it('should observe the host element', () => {
    setup();

    expect(intersectionCallback).toBeDefined();
  });

  it('should emit scrolled when element intersects', () => {
    const { component } = setup();

    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(component.onScrolled).toHaveBeenCalled();
  });

  it('should not emit scrolled when disabled', () => {
    const { fixture, component } = setup();

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(component.onScrolled).not.toHaveBeenCalled();
  });

  it('should not emit scrolled when element is not intersecting', () => {
    const { component } = setup();

    intersectionCallback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(component.onScrolled).not.toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent, LoaderVariant } from '@shared/components/loader/loader.component';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';

describe('LoaderComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [LoaderComponent],
    });
  });

  function setup(
    options: {
      variant?: LoaderVariant;
      message?: string;
      skeletonCount?: number;
      ariaLabel?: string;
    } = {},
  ) {
    const fixture: ComponentFixture<LoaderComponent> = TestBed.createComponent(LoaderComponent);
    const component = fixture.componentInstance;

    if (options.variant) {
      fixture.componentRef.setInput('variant', options.variant);
    }

    if (options.message) {
      fixture.componentRef.setInput('message', options.message);
    }

    if (options.skeletonCount !== undefined) {
      fixture.componentRef.setInput('skeletonCount', options.skeletonCount);
    }

    if (options.ariaLabel) {
      fixture.componentRef.setInput('ariaLabel', options.ariaLabel);
    }

    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    return { fixture, component };
  }

  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should render spinner variant by default', () => {
    const { fixture } = setup();
    const loader = fixture.nativeElement.querySelector('.loader') as HTMLElement;

    expect(loader.getAttribute('aria-label')).toBe('Loading content');
    expect(loader.querySelector('.loader__spinner')).toBeTruthy();
    expect(loader.querySelector('.loader__message')?.textContent?.trim()).toBe('Loading…');
    expect(loader.querySelector('.loader__skeleton-grid')).toBeNull();
    expect(loader.querySelector('.loader__detail-skeleton')).toBeNull();
  });

  it('should render custom spinner message and aria label', () => {
    const { fixture } = setup({
      message: 'Fetching items…',
      ariaLabel: 'Fetching items',
    });
    const loader = fixture.nativeElement.querySelector('.loader') as HTMLElement;

    expect(loader.getAttribute('aria-label')).toBe('Fetching items');
    expect(loader.querySelector('.loader__message')?.textContent?.trim()).toBe('Fetching items…');
  });

  it('should render skeleton grid variant', () => {
    const { fixture } = setup({ variant: 'skeleton', skeletonCount: 4 });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.loader__skeleton-grid')).toBeTruthy();
    expect(element.querySelectorAll('.loader__skeleton-card').length).toBe(4);
    expect(element.querySelector('.loader__spinner')).toBeNull();
  });

  it('should render detail skeleton variant', () => {
    const { fixture } = setup({ variant: 'detail-skeleton' });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.loader__detail-skeleton')).toBeTruthy();
    expect(element.querySelector('.loader__detail-image')).toBeTruthy();
    expect(element.querySelector('.loader__detail-line--title')).toBeTruthy();
    expect(element.querySelectorAll('.loader__detail-line--bullet').length).toBe(4);
    expect(element.querySelector('.loader__spinner')).toBeNull();
  });
});

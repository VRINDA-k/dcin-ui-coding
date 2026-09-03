import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';

describe('EmptyStateComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    });
  });

  function setup(options: { title: string; showAction?: boolean } = { title: 'No items found' }) {
    const fixture: ComponentFixture<EmptyStateComponent> =
      TestBed.createComponent(EmptyStateComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('title', options.title);

    if (options.showAction) {
      fixture.componentRef.setInput('showAction', true);
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

  it('should render title and description', () => {
    const { fixture } = setup({ title: 'No items found' });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.empty-state__title')?.textContent?.trim()).toBe(
      'No items found',
    );
    expect(element.querySelector('.empty-state__description')?.textContent?.trim()).toContain(
      'Try adjusting your search or filters.',
    );
  });

  it('should render action button when showAction is true', () => {
    const { fixture } = setup({ title: 'No items found', showAction: true });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.empty-state__action')?.textContent?.trim()).toBe(
      'Clear filters',
    );
  });

  it('should emit action when button is clicked', () => {
    const { fixture, component } = setup({ title: 'No items found', showAction: true });
    const emitSpy = jest.spyOn(component.action, 'emit');

    (fixture.nativeElement as HTMLElement)
      .querySelector('.empty-state__action')
      ?.dispatchEvent(new Event('click'));

    expect(emitSpy).toHaveBeenCalled();
  });
});

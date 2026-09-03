import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitySelectorComponent } from '@shared/components/quantity-selector/quantity-selector.component';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';

describe('QuantitySelectorComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [QuantitySelectorComponent],
    });
  });

  function setup(options: { max?: number; quantity?: number; disabled?: boolean } = {}) {
    const fixture: ComponentFixture<QuantitySelectorComponent> =
      TestBed.createComponent(QuantitySelectorComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('max', options.max ?? 5);

    if (options.quantity !== undefined) {
      fixture.componentRef.setInput('quantity', options.quantity);
    }

    if (options.disabled) {
      fixture.componentRef.setInput('disabled', true);
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

  it('should increment quantity up to max', () => {
    const { component } = setup({ max: 3, quantity: 2 });

    component.increment();

    expect(component.quantity()).toBe(3);

    component.increment();

    expect(component.quantity()).toBe(3);
  });

  it('should decrement quantity down to 1', () => {
    const { component } = setup({ max: 5, quantity: 2 });

    component.decrement();

    expect(component.quantity()).toBe(1);

    component.decrement();

    expect(component.quantity()).toBe(1);
  });

  it('should not change quantity when disabled', () => {
    const { component } = setup({ max: 5, quantity: 2, disabled: true });

    component.increment();
    component.decrement();

    expect(component.quantity()).toBe(2);
  });

  it('should disable decrease button at minimum quantity', () => {
    const { fixture } = setup({ max: 5, quantity: 1 });
    const element = fixture.nativeElement as HTMLElement;
    const decreaseButton = element.querySelector(
      'button[aria-label="Decrease quantity"]',
    ) as HTMLButtonElement;

    expect(decreaseButton.disabled).toBe(true);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBadgeComponent } from '@shared/components/stock-badge/stock-badge.component';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';

describe('StockBadgeComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [StockBadgeComponent],
    });
  });

  function setup(options: { inStock?: boolean; stockCount?: number; showCount?: boolean } = {}) {
    const fixture: ComponentFixture<StockBadgeComponent> =
      TestBed.createComponent(StockBadgeComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('inStock', options.inStock ?? true);
    fixture.componentRef.setInput('stockCount', options.stockCount ?? 5);

    if (options.showCount === false) {
      fixture.componentRef.setInput('showCount', false);
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

  it('should render in stock label and count', () => {
    const { fixture } = setup({ inStock: true, stockCount: 5 });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.stock-badge__pill')?.textContent).toContain('In Stock');
    expect(element.querySelector('.stock-badge__count')?.textContent?.trim()).toBe(
      '5 left in stock',
    );
  });

  it('should render out of stock label without count', () => {
    const { fixture } = setup({ inStock: false, stockCount: 0 });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.stock-badge__pill')?.textContent).toContain('Out of Stock');
    expect(element.querySelector('.stock-badge__count')).toBeNull();
  });

  it('should hide stock count when showCount is false', () => {
    const { fixture } = setup({ inStock: true, stockCount: 5, showCount: false });
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.stock-badge__count')).toBeNull();
  });
});

import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

let quantitySelectorId = 0;

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  templateUrl: './quantity-selector.component.html',
  styleUrls: ['./quantity-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelectorComponent {
  private readonly controlId = `qty-selector-${++quantitySelectorId}`;

  protected readonly decreaseButtonId = `${this.controlId}-decrease`;
  protected readonly increaseButtonId = `${this.controlId}-increase`;
  protected readonly valueId = `${this.controlId}-value`;

  readonly max = input.required<number>();
  readonly disabled = input(false);
  readonly quantity = model(1);

  decrement(): void {
    if (this.disabled()) {
      return;
    }
    this.quantity.set(Math.max(1, this.quantity() - 1));
  }

  increment(): void {
    if (this.disabled()) {
      return;
    }
    this.quantity.set(Math.min(this.max(), this.quantity() + 1));
  }
}

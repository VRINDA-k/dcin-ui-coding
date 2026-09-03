import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';

export type StockBadgeLayout = 'stacked' | 'inline';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './stock-badge.component.html',
  styleUrls: ['./stock-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockBadgeComponent {
  readonly inStock = input.required<boolean>();
  readonly stockCount = input.required<number>();
  readonly showCount = input(true);
  readonly layout = input<StockBadgeLayout>('stacked');
}

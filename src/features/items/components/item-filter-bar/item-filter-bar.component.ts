import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-item-filter-bar',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './item-filter-bar.component.html',
  styleUrls: ['./item-filter-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFilterBarComponent {
  readonly nameFilter = model('');
  readonly inStockOnly = model(false);

  clearSearch(): void {
    this.nameFilter.set('');
  }
}

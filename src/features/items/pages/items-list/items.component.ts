import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadingService } from '@core/services/loading.service';
import { ItemService } from '@features/items/services/item.service';
import { filterItems } from '@features/items/utils/filter-items';
import { ItemFilterBarComponent } from '@features/items/components/item-filter-bar/item-filter-bar.component';
import { ItemCardComponent } from '@features/items/components/item-card/item-card.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ItemFilterBarComponent,
    ItemCardComponent,
    LoaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  protected readonly loadingService = inject(LoadingService);
  protected readonly itemService = inject(ItemService);

  protected readonly items = toSignal(this.itemService.getItems(), {
    initialValue: [],
  });

  protected readonly nameFilter = signal('');
  protected readonly inStockOnly = signal(false);

  protected readonly filteredItems = computed(() =>
    filterItems(this.items(), this.nameFilter(), this.inStockOnly()),
  );

  protected readonly hasActiveFilters = computed(
    () => this.nameFilter().trim().length > 0 || this.inStockOnly(),
  );

  protected clearFilters(): void {
    this.nameFilter.set('');
    this.inStockOnly.set(false);
  }
}

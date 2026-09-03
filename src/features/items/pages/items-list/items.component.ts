import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';
import { ITEMS_PAGE_SIZE, ItemService } from '@features/items/services/item.service';
import { Item, ItemSortOption } from '@features/items/models/item.model';
import { ItemFilterBarComponent } from '@features/items/components/item-filter-bar/item-filter-bar.component';
import { ItemCardComponent } from '@features/items/components/item-card/item-card.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { InfiniteScrollDirective } from '@shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ItemFilterBarComponent,
    ItemCardComponent,
    LoaderComponent,
    EmptyStateComponent,
    InfiniteScrollDirective,
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loadingService = inject(LoadingService);
  protected readonly itemService = inject(ItemService);

  protected readonly nameFilter = signal('');
  protected readonly inStockOnly = signal(false);
  protected readonly sortBy = signal<ItemSortOption>('default');

  protected readonly loadedItems = signal<Item[]>([]);
  protected readonly hasMore = signal(true);
  protected readonly isLoadingMore = signal(false);

  protected readonly hasActiveFilters = computed(
    () => this.nameFilter().trim().length > 0 || this.inStockOnly() || this.sortBy() !== 'default',
  );

  private offset = 0;
  private loadRequestId = 0;

  constructor() {
    effect(() => {
      this.nameFilter();
      this.inStockOnly();
      this.sortBy();
      untracked(() => this.resetAndLoadFirstPage());
    });
  }

  protected loadMore(): void {
    if (!this.hasMore() || this.isLoadingMore() || this.itemService.loadError()) {
      return;
    }

    const requestId = this.loadRequestId;
    this.isLoadingMore.set(true);

    this.itemService
      .getItemsPage(
        this.offset,
        ITEMS_PAGE_SIZE,
        this.nameFilter(),
        this.inStockOnly(),
        this.sortBy(),
      )
      .pipe(
        finalize(() => {
          if (requestId === this.loadRequestId) {
            this.isLoadingMore.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ items, hasMore }) => {
        if (requestId !== this.loadRequestId) {
          return;
        }

        this.loadedItems.update((current) => [...current, ...items]);
        this.offset += items.length;
        this.hasMore.set(hasMore);
      });
  }

  protected clearFilters(): void {
    this.nameFilter.set('');
    this.inStockOnly.set(false);
    this.sortBy.set('default');
  }

  private resetAndLoadFirstPage(): void {
    this.loadRequestId += 1;
    this.offset = 0;
    this.loadedItems.set([]);
    this.hasMore.set(true);
    this.loadMore();
  }
}

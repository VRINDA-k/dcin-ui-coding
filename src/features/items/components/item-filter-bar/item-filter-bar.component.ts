import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemSortOption } from '@features/items/models/item.model';
import { IconComponent } from '@shared/components/icon/icon.component';

type SortOption = {
  value: ItemSortOption;
  label: string;
  description: string;
};

@Component({
  selector: 'app-item-filter-bar',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './item-filter-bar.component.html',
  styleUrls: ['./item-filter-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFilterBarComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly nameFilter = model('');
  readonly inStockOnly = model(false);
  readonly sortBy = model<ItemSortOption>('default');

  protected readonly isSortOpen = signal(false);

  protected readonly sortOptions: readonly SortOption[] = [
    { value: 'default', label: 'Default', description: 'Original catalog order' },
    { value: 'rate-asc', label: 'Low to high', description: 'Cheapest products first' },
    { value: 'rate-desc', label: 'High to low', description: 'Premium products first' },
  ];

  protected readonly selectedSortLabel = computed(
    () => this.sortOptions.find((option) => option.value === this.sortBy())?.label ?? 'Default',
  );

  protected readonly isSortActive = computed(() => this.sortBy() !== 'default');

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isSortOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isSortOpen.set(false);
  }

  protected toggleSortMenu(): void {
    this.isSortOpen.update((isOpen) => !isOpen);
  }

  protected selectSort(value: ItemSortOption): void {
    this.sortBy.set(value);
    this.isSortOpen.set(false);
  }

  clearSearch(): void {
    this.nameFilter.set('');
  }
}

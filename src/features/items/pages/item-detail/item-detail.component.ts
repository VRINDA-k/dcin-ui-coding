import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';
import { ItemService } from '@features/items/services/item.service';
import { StockBadgeComponent } from '@shared/components/stock-badge/stock-badge.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { QuantitySelectorComponent } from '@shared/components/quantity-selector/quantity-selector.component';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgTemplateOutlet,
    RouterLink,
    StockBadgeComponent,
    QuantitySelectorComponent,
    IconComponent,
    LoaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly loadingService = inject(LoadingService);
  protected readonly itemService = inject(ItemService);

  protected readonly quantity = signal(1);

  protected readonly item = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.itemService.getItemById(id)),
    ),
  );

  protected navigateToItems(): void {
    void this.router.navigate(['/items']);
  }
}

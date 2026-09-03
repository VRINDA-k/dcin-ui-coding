import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LoaderVariant = 'spinner' | 'skeleton' | 'detail-skeleton';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  readonly message = input('Loading…');
  readonly variant = input<LoaderVariant>('spinner');
  readonly skeletonCount = input(8);
  readonly ariaLabel = input('Loading content');

  protected readonly skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8];
}

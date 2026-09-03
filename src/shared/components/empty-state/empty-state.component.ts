import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';

let emptyStateId = 0;

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  private readonly instanceId = ++emptyStateId;

  protected readonly titleId = `empty-state-title-${this.instanceId}`;
  protected readonly actionButtonId = `empty-state-action-${this.instanceId}`;

  readonly title = input.required<string>();
  readonly description = input('Try adjusting your search or filters.');
  readonly actionLabel = input('Clear filters');
  readonly showAction = input(false);

  readonly action = output<void>();
}

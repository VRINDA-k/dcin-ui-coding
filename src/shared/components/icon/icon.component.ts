import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName, ICON_VIEWBOX, SPRITE_URL } from '@shared/icons/icon.model';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg [attr.viewBox]="viewBox()" aria-hidden="true">
      <use [attr.href]="iconHref()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();

  protected readonly viewBox = computed(() => ICON_VIEWBOX[this.name()]);
  protected readonly iconHref = computed(() => `${SPRITE_URL}#${this.name()}`);
}

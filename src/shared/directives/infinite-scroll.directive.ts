import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective {
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject(ElementRef<HTMLElement>);

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly scrolled = output<void>();

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.disabled()) {
            this.scrolled.emit();
          }
        },
        { rootMargin: '200px', threshold: 0 },
      );

      observer.observe(this.element.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

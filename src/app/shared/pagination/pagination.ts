import {
  Component,
  computed,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PaginationLinks, PaginationMeta } from './pagination.data';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination implements OnInit, OnDestroy {
  meta = input.required<PaginationMeta>();
  links = input.required<PaginationLinks>();
  maxVisible = input<number>(5);
  showInfo = input<boolean>(true);

  pageChange = output<number>();

  private isMobile = signal(false);
  private resizeListener?: () => void;

  paginationData = computed(() => {
    const metaData = this.meta();
    const current = metaData.current_page;
    const total = metaData.last_page;
    const maxVisible = this.isMobile() ? 2 : this.maxVisible();

    let visiblePages: number[] = [];

    if (total <= maxVisible + 2) {
      // All pages fit, show them all
      visiblePages = Array.from({ length: total }, (_, i) => i + 1);
    } else {
      // Calculate the range of pages to show around current page
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      // Adjust start if we're too close to the end
      if (end === total) {
        start = Math.max(1, total - maxVisible + 1);
      }

      // Generate visible pages in the calculated range
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    return { visiblePages };
  });

  ngOnInit() {
    this.checkScreenSize();
    this.resizeListener = () => this.checkScreenSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private checkScreenSize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  goToPage(page: number) {
    const metaData = this.meta();
    if (
      metaData &&
      page >= 1 &&
      page <= metaData.last_page &&
      page !== metaData.current_page
    ) {
      this.pageChange.emit(page);
    }
  }
}

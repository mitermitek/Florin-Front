import { Component, computed, input, output, signal, OnInit, OnDestroy } from '@angular/core';
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
    let showFirstPage = false;
    let showLastPage = false;
    let showStartEllipsis = false;
    let showEndEllipsis = false;

    if (total <= maxVisible + 2) {
      // All pages fit
      visiblePages = Array.from({ length: total }, (_, i) => i + 1);
    } else {
      // Calculation of visible pages around the current page
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      // Adjust if close to the end
      if (end === total) {
        start = Math.max(1, total - maxVisible + 1);
      }

      // Visible pages (without the first and last)
      if (start > 2) {
        showFirstPage = true;
        showStartEllipsis = start > 3;
      }

      if (end < total - 1) {
        showLastPage = true;
        showEndEllipsis = end < total - 2;
      }

      // Generate visible pages
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) {
          visiblePages.push(i);
        } else if (i === 1 && !showFirstPage) {
          visiblePages.push(i);
        } else if (i === total && !showLastPage) {
          visiblePages.push(i);
        }
      }
    }

    return {
      visiblePages,
      showFirstPage,
      showLastPage,
      showStartEllipsis,
      showEndEllipsis,
    };
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

  get isOnMobile() {
    return this.isMobile();
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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagination } from './pagination';
import { PaginationLinks, PaginationMeta } from './pagination.data';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  const mockMeta: PaginationMeta = {
    current_page: 1,
    last_page: 5,
    per_page: 10,
    total: 50,
    from: 1,
    to: 10,
    path: 'http://example.com/api',
    links: [
      { url: null, label: '&laquo; Previous', active: false },
      { url: 'http://example.com/api?page=1', label: '1', active: true },
      { url: 'http://example.com/api?page=2', label: '2', active: false },
      { url: 'http://example.com/api?page=3', label: '3', active: false },
      { url: 'http://example.com/api?page=4', label: '4', active: false },
      { url: 'http://example.com/api?page=5', label: '5', active: false },
      {
        url: 'http://example.com/api?page=2',
        label: 'Next &raquo;',
        active: false,
      },
    ],
  };

  const mockLinks: PaginationLinks = {
    first: 'http://example.com/api?page=1',
    last: 'http://example.com/api?page=5',
    prev: null,
    next: 'http://example.com/api?page=2',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('meta', mockMeta);
    fixture.componentRef.setInput('links', mockLinks);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

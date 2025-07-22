import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categories.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(CategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

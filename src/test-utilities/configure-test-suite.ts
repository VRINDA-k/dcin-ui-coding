import { TestBed } from '@angular/core/testing';

export function configureTestSuite(configureModule: () => void): void {
  beforeEach(async () => {
    configureModule();
    await TestBed.compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
}

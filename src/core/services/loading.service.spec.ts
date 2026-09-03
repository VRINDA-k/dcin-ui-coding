import { TestBed } from '@angular/core/testing';

import { LoadingService } from '@core/services/loading.service';
import { configureTestSuite } from 'src/test-utilities/configure-test-suite';

describe('LoadingService', () => {
  let service: LoadingService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
  });

  function setup() {
    service = TestBed.inject(LoadingService);

    return { service };
  }

  it('should not be loading initially', () => {
    const { service } = setup();

    expect(service.isLoading()).toBe(false);
  });

  it('should be loading when show is called', () => {
    const { service } = setup();

    service.show();

    expect(service.isLoading()).toBe(true);
  });

  it('should hide after matching hide calls', () => {
    const { service } = setup();

    service.show();
    service.show();
    service.hide();

    expect(service.isLoading()).toBe(true);

    service.hide();

    expect(service.isLoading()).toBe(false);
  });

  it('should not go below zero pending requests', () => {
    const { service } = setup();

    service.hide();

    expect(service.isLoading()).toBe(false);
  });
});

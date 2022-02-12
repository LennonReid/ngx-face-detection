import { TestBed } from '@angular/core/testing';

import { FaceDetectionService } from './face-detection.service';

describe('FaceDetectionService', () => {
  let service: FaceDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

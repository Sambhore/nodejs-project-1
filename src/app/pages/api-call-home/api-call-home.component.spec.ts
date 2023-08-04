import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCallHomeComponent } from './api-call-home.component';

describe('ApiCallHomeComponent', () => {
  let component: ApiCallHomeComponent;
  let fixture: ComponentFixture<ApiCallHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiCallHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiCallHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

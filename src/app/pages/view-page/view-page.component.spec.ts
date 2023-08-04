import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPageComponent } from './view-page.component';

describe('ViewPageComponent', () => {
  let component: ViewPageComponent;
  let fixture: ComponentFixture<ViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

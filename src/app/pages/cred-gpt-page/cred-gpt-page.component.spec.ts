import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredGptPageComponent } from './cred-gpt-page.component';

describe('CredGptPageComponent', () => {
  let component: CredGptPageComponent;
  let fixture: ComponentFixture<CredGptPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredGptPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredGptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

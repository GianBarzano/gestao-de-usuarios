import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCustomInputComponent } from './my-custom-input.component';

describe('MyCustomInputComponent', () => {
  let component: MyCustomInputComponent;
  let fixture: ComponentFixture<MyCustomInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCustomInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

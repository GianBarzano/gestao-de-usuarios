import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCustomMapComponent } from './my-custom-map.component';

describe('MyCustomMapComponent', () => {
  let component: MyCustomMapComponent;
  let fixture: ComponentFixture<MyCustomMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCustomMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCustomMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

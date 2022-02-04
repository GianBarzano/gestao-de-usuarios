import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarPetsComponent } from './buscar-pets.component';

describe('BuscarPetsComponent', () => {
  let component: BuscarPetsComponent;
  let fixture: ComponentFixture<BuscarPetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarPetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarPetsFiltroComponent } from './buscar-pets-filtro.component';

describe('BuscarPetsFiltroComponent', () => {
  let component: BuscarPetsFiltroComponent;
  let fixture: ComponentFixture<BuscarPetsFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarPetsFiltroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarPetsFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

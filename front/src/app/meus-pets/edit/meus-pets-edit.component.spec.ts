import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusPetsEditComponent } from './meus-pets-edit.component';

describe('MeusPetsEditComponent', () => {
  let component: MeusPetsEditComponent;
  let fixture: ComponentFixture<MeusPetsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeusPetsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeusPetsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

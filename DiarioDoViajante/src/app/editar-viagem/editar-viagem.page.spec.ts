import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarViagemPage } from './editar-viagem.page';

describe('EditarViagemPage', () => {
  let component: EditarViagemPage;
  let fixture: ComponentFixture<EditarViagemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarViagemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
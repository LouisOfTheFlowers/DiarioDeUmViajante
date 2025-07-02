import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarAvaliacaoPage } from './editar-avaliacao.page';

describe('EditarAvaliacaoPage', () => {
  let component: EditarAvaliacaoPage;
  let fixture: ComponentFixture<EditarAvaliacaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarAvaliacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
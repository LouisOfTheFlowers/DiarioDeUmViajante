import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistarAvaliacaoPage } from './registar-avaliacao.page';

describe('RegistarAvaliacaoPage', () => {
  let component: RegistarAvaliacaoPage;
  let fixture: ComponentFixture<RegistarAvaliacaoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistarAvaliacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

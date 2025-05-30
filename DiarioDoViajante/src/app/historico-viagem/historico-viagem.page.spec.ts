import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricoViagemPage } from './historico-viagem.page';

describe('HistoricoViagemPage', () => {
  let component: HistoricoViagemPage;
  let fixture: ComponentFixture<HistoricoViagemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoViagemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

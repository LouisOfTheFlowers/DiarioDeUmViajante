import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistarViagemPage } from './registar-viagem.page';

describe('RegistarViagemPage', () => {
  let component: RegistarViagemPage;
  let fixture: ComponentFixture<RegistarViagemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistarViagemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

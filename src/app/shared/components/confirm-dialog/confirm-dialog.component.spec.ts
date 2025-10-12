import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  function openDialog(): void {
    component.open = true;
    component.busy = false;
    fixture.detectChanges();
  }

  it('emits cancel when cancel button is clicked', () => {
    openDialog();
    const cancelSpy = spyOn(component.cancel, 'emit');

    const cancelButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.btn-ghost');
    cancelButton?.click();

    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it('emits confirm when confirm button is clicked', () => {
    openDialog();
    const confirmSpy = spyOn(component.confirm, 'emit');

    const confirmButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button:last-of-type');
    confirmButton?.click();

    expect(confirmSpy).toHaveBeenCalledTimes(1);
  });

  it('does not emit events while busy', () => {
    component.open = true;
    component.busy = true;
    fixture.detectChanges();

    const cancelSpy = spyOn(component.cancel, 'emit');
    const confirmSpy = spyOn(component.confirm, 'emit');

    const [cancelButton, confirmButton] = fixture.nativeElement.querySelectorAll('button');
    (cancelButton as HTMLButtonElement).click();
    (confirmButton as HTMLButtonElement).click();

    expect(cancelSpy).not.toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('emits cancel when escape key is pressed', () => {
    openDialog();
    const cancelSpy = spyOn(component.cancel, 'emit');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it('emits cancel when clicking on the backdrop', () => {
    openDialog();
    const cancelSpy = spyOn(component.cancel, 'emit');

    const backdrop: HTMLElement | null = fixture.nativeElement.querySelector('[data-testid="confirm-dialog-backdrop"]');
    backdrop?.click();

    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });
});

import Swal, { SweetAlertOptions } from "sweetalert2";

const luxuryMixin = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  focusCancel: true,
  customClass: {
    container: "fs-swal-container",
    popup: "fs-swal-popup",
    title: "fs-swal-title",
    htmlContainer: "fs-swal-html",
    actions: "fs-swal-actions",
    confirmButton: "fs-swal-confirm",
    cancelButton: "fs-swal-cancel",
    icon: "fs-swal-icon",
  },
});

export interface ConfirmActionOptions {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
}

/**
 * Luxury minimalist confirmation dialog replacing browser native confirm()
 */
export async function confirmAction({
  title,
  text,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
}: ConfirmActionOptions): Promise<boolean> {
  const result = await luxuryMixin.fire({
    title,
    text,
    icon: variant === "destructive" ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      container: "fs-swal-container",
      popup: "fs-swal-popup",
      title: "fs-swal-title",
      htmlContainer: "fs-swal-html",
      actions: "fs-swal-actions",
      confirmButton:
        variant === "destructive"
          ? "fs-swal-confirm fs-swal-confirm-destructive"
          : "fs-swal-confirm",
      cancelButton: "fs-swal-cancel",
      icon: "fs-swal-icon",
    },
  });

  return result.isConfirmed;
}

export async function showSuccessAlert(title: string, text?: string) {
  return luxuryMixin.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Continue",
  });
}

export async function showErrorAlert(title: string, text?: string) {
  return luxuryMixin.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Dismiss",
  });
}

export async function showCustomAlert(options: SweetAlertOptions) {
  return luxuryMixin.fire(options);
}

export default luxuryMixin;

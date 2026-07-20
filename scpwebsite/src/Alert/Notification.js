import React from "react";
import Swal from "sweetalert2";

const Notification = ({ message, type, onConfirm }) => {
  // Set default message based on the type
  if (type === "success" && !message) message = "Executed Successfully";
  if (type === "error" && !message) message = "Sorry! Failed to Execute";

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  });

  if (type === "confirm") {
    // Display confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: message || 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (onConfirm) onConfirm();  // Call the callback function on confirmation
        Swal.fire('Confirmed!', 'Action was executed.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Action was cancelled.', 'error');
      }
    });
  } else {
    // Display toast notification for success or error
    Toast.fire({
      icon: type,
      title: message,
    });
  }
};

export default Notification;
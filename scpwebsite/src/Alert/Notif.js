import Swal from "sweetalert2";

export const Notification = (props) =>{
  
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: props.icon,
      title: props.title,
     
    });
  }


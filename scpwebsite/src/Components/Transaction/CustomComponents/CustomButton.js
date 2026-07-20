import { Button } from "react-bootstrap";

const CustomButton = ({ label, onClick, variant = 'primary', type="button", size = 'sm', ...props }) => {
  return (
    <Button
      type={type}
      className={`bg-${variant} mt-2`}
      size={size}
      onClick={onClick}
      {...props}
    >
      {label}
    </Button>
  );
};


export default CustomButton
import { Form, FormGroup, FormLabel, FormControl } from "react-bootstrap";

const CustomCheckbox = ({ label, checked, onChange, ...props }) => {
  return (
    <Form.Group controlId={label}>
      <Form.Check
        type="checkbox"
        label={label}
        checked={checked}
        onChange={onChange}
        className="form-control-sm"
        {...props}
      />
    </Form.Group>
  );
};




export default CustomCheckbox
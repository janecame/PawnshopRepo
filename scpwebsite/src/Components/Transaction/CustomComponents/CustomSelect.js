/*import { Form } from "react-bootstrap";

const CustomSelect = ({ 
  label, 
  options = [], 
  value = "", 
  onChange, 
  name, 
  valueKey = "value",  // Default key for option values
  labelKey = "label",  // Default key for option labels
  required = true, 
  ...props 
}) => {
  return (
    <div className="m-1">
      <small htmlFor={name}>{label}</small>
      <Form.Select
        className="form-select fw-bold text-center"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      > 
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option[valueKey]}>
            {option[labelKey]}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

export default CustomSelect;
*/



import React from 'react';
import { Form } from 'react-bootstrap'; // Ensure Bootstrap is installed and imported

const CustomSelect = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Select",
  valueKey = "",
  labelKey = "",
  required = false,
  size = "small",
  id="",
  disabled=false,
  error=false,
  helperText=""
}) => {

 const sizeClass = {
    normal: "",
    large: "form-control-lg",
    small: "form-control-sm",
  }[size]

  return (
    <Form.Group className="input-box select">
      <small>
        {label + " "}
        {required && <span className="required-asterisk" style={{ color: "Red" }}>*</span>}
      </small>
      <Form.Control as="select" name={name} id={id} value={value} onChange={onChange} className={`${sizeClass} ${error ? "is-invalid" : ""}`} disabled={disabled}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey]}
          </option>
        ))}
      </Form.Control>
      {error && (
        <Form.Text className="text-danger">{helperText}</Form.Text>
      )}
    </Form.Group>
  );
};

export default CustomSelect;


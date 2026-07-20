import React from 'react';
import { Form } from 'react-bootstrap';
import { formatNumber } from "../../../utils/TypeConvertions"

const CustomInput = ({ 
  label, 
  type, 
  name, 
  value,
  onChange, 
  onBlur, 
  required=true, 
  placeholder, 
  disabled = false, 
  size = "normal", 
  pattern = undefined, 
  onKeyDown, 
  title="", 
  className,
  error=false,
  helperText="",
  decimal = false,
  width
}) => {

 const sizeClass = {
    normal: "",
    large: "form-control-lg",
    small: "form-control-sm",
  }[size]


const formattedValue = decimal ? formatNumber(value) : value;

  
    
return (
    <Form.Group className={`${width} input-box input`} >
      {label === "" ?
        <></>
        :
        <small>
          {label + " "}
          {required && <span className="required-asterisk" style={{ color: "Red" }}>*</span>}
        </small>
      }
      
      <Form.Control
        type={type}
        name={name}
        value={formattedValue}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`${sizeClass} ${className} ${error ? "is-invalid" : ""}`} 
        pattern={pattern}
        onKeyDown={onKeyDown}
        title={title} 
      />
      {error && (
        <Form.Text className="text-danger">{helperText}</Form.Text>
      )}
    </Form.Group>
  );
};

export default CustomInput;



import React from 'react'

import './user-input.css'

const UserInput = ({className, type, name, placeholder, value, onChange, onClick}) => {
  return <input className={className}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onClick={onClick}/>
};

export default UserInput;

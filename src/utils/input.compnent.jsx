import React from "react";

const FormInput = ({handleChange, label, ...otherProps }) => (
    <div className="">
        <input className='form-input' onChange={handleChange} {...otherProps} />
        {
            label ? (
                <label
                className={`${otherProps.value ? 'shrink' : ''} form-input-label` }
                >{label}</label>
            ) : null
        }
    </div>
)

export default FormInput
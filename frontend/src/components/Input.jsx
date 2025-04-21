import React from 'react'

function Input(
    {
        type = 'text',
        name = 'Agency Name',
        id = 'AgencyName',
        placeholder = 'Agency Name',
        className = 'w-full p-2  m-4 ',
        value = '',
        ...props
    }
) {
    return (
        <>
            <input type="text" name={name} id={id}
                placeholder={placeholder} className={ ` ${className}`} {...props}/>
        </>
    )
}

export default Input
import React from 'react'

function Button({
    classname,
    children,
}) {
  return (
    <div className={`${classname}`}>{children}</div>
  )
}

export default Button
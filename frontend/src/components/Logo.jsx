import React from 'react'

function Logo({width='70px', height='70px',className,...props}) {
  return (
    <img src="/src/assets/logo.png" alt="logo" className={`w-20 h-20 border-2 ${className}`} 
    {...props}
    style={{width: width, height: height}} 
    />
  
  )
}

export default Logo
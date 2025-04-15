import React from 'react'
import { Input } from '../components'

function Company() {
  return (
    <>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 rounded-2xl m-4 '  >  
    <h1 className='text-3xl text-center mb-4'>Pharmacy Dashboard</h1>
    <br />
    <br />
     <h3 className='text-center text-xl'>Agencies List </h3>

     <div className='flex items-center justify-center m-4 '>
        <Input type="text" name='Agency Name' id='AgencyName'
        placeholder='Agency Name'  />

        <Input type="text" name="license" id="license No"
        placeholder='Enter License No'  />

        <Input type="text" name="license" id="license No"
        placeholder='Enter License No'  />

        <Input type="text" name="license" id="license No"
        placeholder='Enter License No'  />

        <Input type="text" name="license" id="license No"
        placeholder='Enter License No'  />

        <Input type="text" name="license" id="license No"
        placeholder='Enter License No'  />
    

     </div>
    </div>
    </>
  )
}

export default Company
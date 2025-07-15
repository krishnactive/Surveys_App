import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-1/2 px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'>SurveysApp</h2>
            {children}
        </div>

        <div className=' hidden md:block w-1/2 h-screen bg-green-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow rounded-l-3xl '>
        {/* cards show */}
        </div>

    </div>
  )
}

export default AuthLayout
// hidden md:block w-1/2 h-screen bg-green-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow rounded-l-3xl
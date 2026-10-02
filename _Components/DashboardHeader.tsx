import React from 'react'

const DashboardHeader = () => {
  return (
    <div className="w-7xl mx-auto p-5">
      <div className=' bg-green-500 rounded-lg p-2'>
        <div className='flex justify-between items-center'>
          <div>
            Dashboard
          </div>
          <div className='flex items-center gap-4'>
            <div>icons</div>
            <div className='flex items-center gap-2'>
              <div className='bg-white p-3 rounded-full '></div>
              <p>Dossou</p>
            </div>
          
          </div>
        </div>


      </div>
    </div>
  )
}

export default DashboardHeader;
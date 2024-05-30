import React from 'react'

function LabResult({ name }: { name: string }) {
    return (
        <div className="flex justify-between space-y-3 p-3 hover:bg-slate-100 ">
            <div className='flex items-center space-x-3'>
                <div className='text-sm'>
                    {name}
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>

        </div>
    )
}

export default LabResult
import React from 'react'
import Image from 'next/image'

export interface ListOfDiagnosis {
    name: string;
    description: string;
    status: string;
}

export interface PatientProps {
    name: string,

    diagnosis_history?: any;

    profile_picture: string,
    gender: string,
    age: string,
    onClick: () => void;
    selected: boolean;
    phone_number?: string;
    emergency_contact?: string;
    insurance_type?: string;

    lab_results?: string[]

    date_of_birth?: string;

    diagnostic_list?: ListOfDiagnosis[]
}

function Patient({ name, profile_picture, gender, age, onClick, selected }: PatientProps) {
    return (
        <div onClick={onClick} className={`cursor-pointer ${selected ? 'bg-[#D8FCF7]' : ''}`}>
            <div className="flex justify-between space-y-3 flex-1 h-full overflow-auto p-3">
                <div className='flex items-center space-x-3 '>
                    <Image src={profile_picture || ''} alt="profile-image" width={44} height={44} />
                    <div className='text-xs'>
                        <p className="font-semibold">{name}</p>
                        <p className="text-gray-400">{gender}, {age}</p>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>

            </div>

        </div>
    )
}

export default Patient
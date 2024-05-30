import { color } from 'chart.js/helpers'
import Image from 'next/image';
import React from 'react'

function DiagnosticCard({ color, image, alt, name, measurement, Level }: any) {
    return (
        <div className='h-[242px] w-[240px] rounded-xl p-4' style={{ backgroundColor: color }}>
            <Image src={image} alt={alt} height={96} width={96} />
            <p className="text-sm">{name}</p>
            <p className='text-3xl font-bold'>{measurement}</p>
            <div className="text-xs">{Level}</div>
        </div>
    )
}

export default DiagnosticCard
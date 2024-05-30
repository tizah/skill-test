import React from 'react'

function DiagnosticList({ name, description, status }: { name: string, description: string, status: string }) {
    return (



        <tbody>
            <tr className="bg-white border-b ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {name}
                </th>
                <td className="px-6 py-4">
                    {description}
                </td>
                <td className="px-6 py-4">
                    {status}
                </td>

            </tr>
        </tbody>


    )
}

export default DiagnosticList
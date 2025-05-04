import React from 'react'

export const Cell = React.memo(({ title, asHeader }: { title: string; asHeader?: boolean }) =>
  asHeader ? (
    <th className={'p-4 border-b border-blue-gray-100 bg-blue-gray-50'}>
      <p className={'block font-sans text-sm font-normal text-blue-gray-900 opacity-70'}>{title}</p>
    </th>
  ) : (
    <td className={'p-4 border-b border-blue-gray-50'}>
      <span className={'block font-sans text-sm font-medium text-blue-gray-900'}>{title}</span>
    </td>
  ),
)

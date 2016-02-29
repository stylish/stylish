import React from 'react'

export function ProgressReport(report = {}) {
	const items = Object.keys(report).map((item,i) => {
		let width = parseInt(report[item]) + '%';
		return <li className='list-group-item' key={i}>
			{item}
			<span className='list-group-progress' style={{width}} />
		</li>
	})

	return ( <ul className='list-group'> {items} </ul>)
}

export default ProgressReport

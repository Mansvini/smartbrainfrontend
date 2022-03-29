import React from 'react';
import './FaceRecognition.css';


const FaceRecognition=({imageUrl, boxes})=>{
	return(
		<div className='center ma'>
			<div className='absolute mt2'>
				<img 
					id="inputimage"
					alt='' 
					src={imageUrl} 
					width='500px' 
					height='auto'
				/>
				{boxes.map((box,i)=>{
					return(
						<div 
							key={i}
							className='boundingBox'
							style={{top: box.topRow, left: box.leftCol, right: box.rightCol, bottom: box.bottomRow}}>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default FaceRecognition;
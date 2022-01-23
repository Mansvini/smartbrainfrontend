import React from 'react';
import './FaceRecognition.css';

const FaceRecognition=({imageUrl, box})=>{
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
				<div 
					className='boundingBox'
					style={{top: box.topRow, left: box.leftCol, right: box.rightCol, bottom: box.bottomRow}}>
				</div>
			</div>
		</div>
	)
}

export default FaceRecognition;
import React, { Component } from 'react'
import styled from 'styled-components'
import 'semantic-ui-css/semantic.min.css'
// import { useSpring, useTransition, animated } from "react-spring"
import { Transition, Keyframes, animated } from 'react-spring/renderprops'


import './AnnotationContainer.css'

const ClosedPanel = {
	width: 100,
	padding: 0,
	background: 'linear-gradient(to right, #30e8bf, #ff8235)',
	transform: 'translate3d(400px,0,0) scale(2) rotateX(90deg)',
	boxShadow: '0px 100px 150px -10px #2D3747',
	border: '0px solid black'
}

const OpenPanelHalf = {
	width: 'auto',
	padding: 20,
	background: 'linear-gradient(to right, #009fff, #ec2f4b)',
	transform: 'translate3d(0px,0,0) scale(1) rotateX(0deg)',
	boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.4)',
	border: '10px solid #2D3747'
}

const Sidebar = Keyframes.Spring({
	
	// single items,
    full: { x: 0, w: 95, },
    half: { x: 0, w: 51 },
	// or async functions with side-effects
	close: { x: -100, w: 50 }
})

export default class AnnotationContainer extends Component {
    state = { annoOpen: true, noteOpen: true }
    
	render() {
        let state = 'close'
        if (this.props.isOpen) {
            if (this.props.notesOpen) state = 'half'
            else state = 'full'
        }
		return (
			<div>
                
				<Sidebar native state={state}>
					{(props) => (
						<animated.div
							className="anno_sidebar"
							style={{
								transform: props.x.interpolate(
									x => `translate3d(${x}%,0,0)` 
								),
                                width: props.w.interpolate(w => `${w}rem`)
							}}
						></animated.div>
					)}
				</Sidebar>
                {/* <Spring
                    from={ClosedPanel}
                    to={OpenPanelHalf}>
                    {props => (
                        <animated.div style={props}>

                        </animated.div>
                    )}
                </Spring>  */}
			</div>
		)

		// let openClass = 'annotation-drawer'
		// if (this.props.isOpen) {
		//     if (this.props.notesOpen) {
		//         openClass = 'annotation-drawer half'
		//     } else {
		//         openClass = 'annotation-drawer full'
		//     }
		// }

		// return(
		//     <div className={openClass}>
		//         <h1>Hello World</h1>
		//     </div>
		// )

		
			
		
	}
}

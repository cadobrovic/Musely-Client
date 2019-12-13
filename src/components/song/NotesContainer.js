// NotesContainer.js

import React, { Component } from 'react'
import styled from 'styled-components'
import 'semantic-ui-css/semantic.min.css'
// import { useSpring, useTransition, animated } from "react-spring"
import { Transition, Keyframes, animated } from 'react-spring/renderprops'

import './NotesContainer.css'

const Sidebar = Keyframes.Spring({
	
	// single items,
    full: { x: -45, w: 100, },
    half: { x: 1, w: 60 },
    close: { x: 55, w: 60 },
    closeHalf: { x: 9, w: 60 },
})

export default class AnnotationContainer extends Component {
    state = { annoOpen: true, noteOpen: true }
    
	render() {
        let state = 'close'
        if (this.props.isOpen) {
            if (this.props.annoOpen) state = 'half'
            else state = 'full'
        } else {
            if (this.props.annoOpen) state = 'closeHalf'
        }
		return (
			<div>
				<Sidebar native state={state}>
					{(props) => (
						<animated.div
							className="notes_sidebar"
							style={{
								transform: props.x.interpolate(
									x => `translate3d(${x}vw,0,0)` 
								),
                                width: props.w.interpolate(w => `${w}rem`)
							}}
						></animated.div>
					)}
				</Sidebar>
			</div>
		)
		
	}
}

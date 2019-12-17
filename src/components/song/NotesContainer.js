// NotesContainer.js

import React, { Component } from 'react'
import styled from 'styled-components'
import { Segment, Button, Icon, Label, Form, TextArea } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
// import { useSpring, useTransition, animated } from "react-spring"
import { Keyframes, animated } from 'react-spring/renderprops'

import './NotesContainer.css'

const Sidebar = Keyframes.Spring({
    // single items,
    full: { x: -46, w: 105 },
    half: { x: 3, w: 60 },
    close: { x: 80, w: 60 },
    closeHalf: { x: 15, w: 60 }
})

const Container = styled.div`
    overflow-y: auto;
    height: 100%;
    padding: 20px 20px 10px 20px;
`

export default class NotesContainer extends Component {
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
            <div className={'notes_sidebar_' + state}>
                <Label
                    style={{ borderRadius: '15px .21428571rem 0 0' }}
                    attached="top"
                    size="huge"
                >
                    Notes
                </Label>
                <Container>
                    <Form>
                        <TextArea
                            placeholder="Type notes here..."
                            value={this.state.text}
                            onChange={this.handleTextChange}
                            style={{
                                minHeight: 400,
                                resize: 'none',
                                paddingLeft: 10,
                                paddingTop: 10,
                                paddingRight: 10,
                                paddingBottom: 10,
                                fontSize: 18
                            }}
                        />
                    </Form>
                </Container>
            </div>
        )
    }
}

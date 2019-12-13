import React, { Component } from 'react'
import styled from 'styled-components'
import 'semantic-ui-css/semantic.min.css'
// import Note from './Note'
import Waveform from './Waveform'
import AnnotationContainer from './AnnotationContainer'
import NotesContainer from './NotesContainer'
import EditAnnotation from './EditAnnotation'
import { connect } from 'react-redux'
import {
    addNote,
    addAnnotation,
    updateNote,
    updateAnnotation
} from '../../actions'

const SongHeader = styled.h1`
    padding-left: 3rem;
    padding-top: 2rem;
    font-size: 50px;
    color: black;
`

const SongWrapper = styled.div`
    position: relative;
    height: 100%;
`

class SongContainer extends Component {
    constructor(props) {
        super(props)
        const { dispatch } = this.props

        this.handleCursor = this.handleCursor.bind(this)
        this.handleCursorMove = this.handleCursorMove.bind(this)
        this.handleRegion = this.handleRegion.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleTagChange = this.handleTagChange.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        //this.handleTimeChange = this.handleTimeChange.bind(this)

        this.state = {
            playing: false,

            annotationDrawerIsOpen: false,
            notesDrawerIsOpen: false,
            text: '',
            start_time: 0,
            end_time: 0,
            cursorTime: 0,
            currentTime: 0,
            tag: ''
        }
    }

    handleCursor = data => {
        let curr = parseInt(data.currentTime)
        if (data.region) {
            this.setState({
                currentTime: curr
            })
        } else {
            this.setState({
                start_time: curr,
                end_time: curr + 10,
                currentTime: curr
            })
        }
    }

    handleCursorMove = currentTime => {
        let curr = parseInt(currentTime)
        this.setState({
            cursorTime: curr
        })
    }

    handleRegion = ({ start, end }) => {
        this.setState({
            start_time: start,
            end_time: end
        })
    }

    handlePlay = currentTime => {
        this.setState({
            currentTime: currentTime
        })
    }

    handleTogglePlay = () => {
        this.setState({
            playing: !this.state.playing
        })
    }

    handleSave = () => {
        let hasAnnotation = false
        const { dispatch } = this.props
        if (hasAnnotation) {
            // TODO: Implement update annotation
        } else {
            dispatch(
                addAnnotation({
                    text: this.state.text,
                    start_time: this.state.start_time,
                    end_time: this.state.end_time,
                    tag: this.state.tag
                })
            )
        }
    }

    handleTagChange = (e, data) => {
        this.setState({
            tag: data.value
        })
    }

    handleTextChange = (e, data) => {
        e.preventDefault()
        this.setState({
            text: data.value
        })
    }

    //methods for attempting to do input
    //handleTimeChange = timeFields => {
    //console.log(timeFields)
    //if (timeFields.sm !== NaN || timeFields.ss !== NaN) {
    //this.setState({
    //start_time: this.formatTime(timeFields)
    //})
    //} else if (timeFields.em !== NaN || timeFields.es !== NaN) {
    //this.setState({
    //end_time: this.formatTime(timeFields)
    //})
    //}
    //}

    //formatTime = ({ sm, ss, em, es }) => {
    //let { minutes: currsm, seconds: currss } = this.sec_toMS(
    //this.state.start_time
    //)
    //let { minutes: currem, seconds: curres } = this.sec_toMS(
    //this.state.end_time
    //)

    //if (sm !== undefined) {
    //return this.ms_toSec({
    //minutes: Math.abs(parseInt(currsm) - parseInt(sm)),
    //seconds: parseInt(currss)
    //})
    //} else if (ss !== undefined) {
    //return this.ms_toSec({
    //minutes: Math.abs(parseInt(currss) - parseInt(ss)),
    //seconds: parseInt(currss)
    //})
    //} else if (em !== undefined) {
    //return this.ms_toSec({
    //minutes: Math.abs(parseInt(currem) - parseInt(em)),
    //seconds: parseInt(currss)
    //})
    //} else if (es !== undefined) {
    //return this.ms_toSec({
    //minutes: Math.abs(parseInt(curres) - parseInt(es)),
    //seconds: parseInt(currss)
    //})
    //}
    //}

    //sec_toMS = time => {
    //let curr = parseInt(time)
    //let minutes = Math.floor(curr / 60)
    //let seconds = curr - minutes * 60
    //let min_str = minutes.toString()
    //if (min_str.length < 2) min_str = '0' + min_str
    //let sec_str = seconds.toString()
    //if (sec_str.length < 2) sec_str = '0' + sec_str
    //return { minutes: min_str, seconds: sec_str }
    //}

    //ms_toSec = ({ minutes, seconds }) => {
    //return minutes * 60 + seconds
    //}

    render() {
        const { name } = this.props.match.params
        return (
            <SongWrapper>
                <SongHeader>{name}</SongHeader>
                <Waveform
                    src={`/${this.props.match.params.name}.mp3`}
                    currentTime={this.state.currentTime}
                    cursorTime={this.state.cursorTime}
                    handlePlay={this.handlePlay}
                    handleCursor={this.handleCursor}
                    handleCursorMove={this.handleCursorMove}
                    handleRegion={this.handleRegion}
                />
                <EditAnnotation
                    handleSave={this.handleSave}
                    handleTagChange={this.handleTagChange}
                    handleTextChange={this.handleTextChange}
                    start_time={this.state.start_time}
                    end_time={this.state.end_time}
                />

                <SongHeader>Notes</SongHeader>
                <button onClick={() => {this.setState({annotationDrawerIsOpen: !this.state.annotationDrawerIsOpen})}}>Open Annotations</button>

                <button onClick={() => {this.setState({notesDrawerIsOpen: !this.state.notesDrawerIsOpen})}}>Open Note</button>


                <div style={{display: 'inline-flex', marginTop: '10px', width:'100%'}}>
                    <AnnotationContainer isOpen={this.state.annotationDrawerIsOpen} notesOpen={this.state.notesDrawerIsOpen}/>
                    <NotesContainer isOpen={this.state.notesDrawerIsOpen} annoOpen={this.state.annotationDrawerIsOpen} />
                </div>

            </SongWrapper>
        )
    }
}
const mapStateToProps = state => {
    return {
        notes: state.notes,
        annotations: state.annotations
    }
}

export default connect(mapStateToProps)(SongContainer)

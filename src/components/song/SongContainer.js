import React, { Component } from 'react'
import styled from 'styled-components'
import { Sidebar, Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
// import Note from './Note'
import Waveform from './Waveform'
import AnnotationContainer from './AnnotationContainer'
import NotesContainer from './NotesContainer'
import EditAnnotation from './EditAnnotation'
import TimelineTag from './TimelineTag'
import { connect } from 'react-redux'
import { addAnnotation, addTag, deleteTag, toggleAnnotation, deleteAnnotation } from '../../actions'
import toggle from '../../reducers/toggle'

const SongHeader = styled.h1`
    padding-left: 3rem;
    padding-top: 2rem;
    font-size: 50px;
    color: black;
`

const SongWrapper = styled.div`
    position: relative;
    height: 100%;
    background-color: rgb(233, 233, 233);
`

const TagTimelineWrapper = styled.div`
    width: 80%;
    height: auto;
    margin: auto;
`

class SongContainer extends Component {
    constructor(props) {
        super(props)
        this.handleCursor = this.handleCursor.bind(this)
        this.handleCursorMove = this.handleCursorMove.bind(this)
        this.handleRegion = this.handleRegion.bind(this)
        this.handlePlay = this.handlePlay.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleDiscard = this.handleDiscard.bind(this)
        this.handleTagChange = this.handleTagChange.bind(this)
        this.handleTextChange = this.handleTextChange.bind(this)
        this.getSongDuration = this.getSongDuration.bind(this)

        this.state = {
            playing: false,
            annotationDrawerIsOpen: true,
            notesDrawerIsOpen: true,
            isEditingAnnotation: false,
            text: '',
            start_time: 0,
            end_time: 0,
            cursorTime: 0,
            currentTime: 0,
            tag: '',
            songDuration: 1,
            selectedTag: 'Afghanistan'
        }
    }

    handleCursor = data => {
        const { toggle, annotations } = this.props
        let curr = parseInt(data.currentTime)
        if (toggle.id === null) {
            this.setState({
                start_time: curr,
                end_time: curr + 10,
                currentTime: curr
            })
        } else {
            const idx = annotations.findIndex(ann => ann.id === toggle.id)
            if (idx !== -1) {
                this.setState({
                    start_time: annotations[idx].start_time,
                    end_time: annotations[idx].end_time
                })
            }
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
        console.log('HANDLE SAVE')
        let hasAnnotation = false
        const { dispatch, toggle } = this.props
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
            dispatch(
                addTag({
                    name: this.state.tag
                })
            )
        }
        dispatch(
            toggleAnnotation({
                isEditing: !toggle.isEditing,
                id: toggle.id
            })
        )
    }

    handleDiscard = () => {
        const { dispatch, toggle, annotations } = this.props
        console.log(toggle.id)
        // find tag of annotation with this id
        let name = ''
        annotations.forEach(a => {
            if (a.id === toggle.id) name = a.tag
        })
        console.log('delete name', name)
        dispatch(
            deleteTag({
                name: name
            })
        )
        dispatch(
            deleteAnnotation({
                id: toggle.id
            })
        )
        dispatch(
            toggleAnnotation({
                isEditing: !toggle.isEditing,
                id: null
            })
        )
    }

    handleTagChange = tag => {
        this.setState({
            tag: tag
        })
    }

    handleTextChange = text => {
        this.setState({
            text: text
        })
    }

    getSongDuration = data => {
        this.setState({
            songDuration: data
        })
    }

    chooseTag = tag => {
        this.setState({
            selectedTag: tag
        })
    }

    render() {
        const { name } = this.props.match.params
        return (
            <SongWrapper>
                <SongHeader>{name}</SongHeader>
                <Waveform
                    //src={`/${name}.mp3`}
                    src={'/jeneregretterien.mp3'}
                    currentTime={this.state.currentTime}
                    cursorTime={this.state.cursorTime}
                    handlePlay={this.handlePlay}
                    handleCursor={this.handleCursor}
                    handleCursorMove={this.handleCursorMove}
                    handleRegion={this.handleRegion}
                    getSongDuration={this.getSongDuration}
                />
                <TagTimelineWrapper>
                    <TimelineTag
                        duration={this.state.songDuration}
                        chooseTag={this.chooseTag}
                    />
                </TagTimelineWrapper>
                <Sidebar
                    as={Segment}
                    direction="bottom"
                    visible={this.props.toggle.isEditing}
                    animation="push"
                >
                    <EditAnnotation
                        handleSave={this.handleSave}
                        handleDiscard={this.handleDiscard}
                        handleTagChange={this.handleTagChange}
                        handleTextChange={this.handleTextChange}
                        start_time={this.state.start_time}
                        end_time={this.state.end_time}
                    />
                </Sidebar>

                <SongHeader>Notes</SongHeader>
                <button
                    onClick={() => {
                        const { dispatch, toggle } = this.props
                        dispatch(
                            toggleAnnotation({
                                isEditing: !toggle.isEditing,
                                id: null
                            })
                        )
                        this.setState({
                            isEditingAnnotation: !this.state.isEditingAnnotation
                        })
                    }}
                >
                    Edit Annotation
                </button>
                <button
                    onClick={() => {
                        this.setState({
                            annotationDrawerIsOpen: !this.state
                                .annotationDrawerIsOpen
                        })
                    }}
                >
                    Open Annotations
                </button>

                <button
                    onClick={() => {
                        this.setState({
                            notesDrawerIsOpen: !this.state.notesDrawerIsOpen
                        })
                    }}
                >
                    Open Note
                </button>

                <div
                    style={{
                        display: 'inline-flex',
                        marginTop: '10px',
                        width: '100%'
                    }}
                >
                    <AnnotationContainer
                        isOpen={this.state.annotationDrawerIsOpen}
                        notesOpen={this.state.notesDrawerIsOpen}
                        selectedTag={this.state.selectedTag}
                    />
                    <NotesContainer
                        isOpen={this.state.notesDrawerIsOpen}
                        annoOpen={this.state.annotationDrawerIsOpen}
                    />
                </div>
            </SongWrapper>
        )
    }
}
const mapStateToProps = state => {
    return {
        notes: state.notes,
        annotations: state.annotations,
        tags: state.tags,
        toggle: state.toggle
    }
}

export default connect(mapStateToProps)(SongContainer)

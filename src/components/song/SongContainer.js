import React, { Component } from 'react'
import styled from 'styled-components'
import { Sidebar, Segment, Button, Icon, Label } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
// import Note from './Note'
import Waveform from './Waveform'
import AnnotationContainer from './AnnotationContainer'
import NotesContainer from './NotesContainer'
import EditAnnotation from './EditAnnotation'
import TimelineTag from './TimelineTag'
import { connect } from 'react-redux'
import '../nav/NavBar.css'
import {
    addAnnotation,
    updateAnnotation,
    addTag,
    deleteTag,
    toggleAnnotation,
    deleteAnnotation
} from '../../actions'
import toggle from '../../reducers/toggle'

const SongHeader = styled.h1`
    padding-left: 3rem;
    padding-top: 2rem;
    font-size: 50px;
    color: black;
`

const MediaButtonsWrapper = styled.div`
    height: auto;
    margin-bottom: 0.5rem;
    margin-left: auto;
    margin-right: auto;
    padding-top: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const SongWrapper = styled.div`
    position: relative;
    height: 100%;
    padding-top: 3rem;
    background-color: rgb(206, 217, 213);
`

const TagTimelineWrapper = styled.div`
    width: 80%;
    height: auto;
    margin: auto;
`

const InteractiveButtonWrapper = styled.div`
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
        this.getCurrentTime = this.getCurrentTime.bind(this)
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
            currentEditColor: '',
            tag: '',
            songDuration: 1,
            selectedTag: ''
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { toggle, annotations, tags } = nextProps
        // find tag color
        let color = this.state.currentEditColor
        for (var i = 0; i < annotations.length; i++) {
            if (annotations[i].id === toggle.id) {
                var selectedAnnoTag = annotations[i].tag
                for (var j = 0; j < tags.length; j++) {
                    if (tags[j].name === selectedAnnoTag) {
                        color = tags[j].color
                    }
                }
                this.setState({
                    currentEditColor: color
                })
            }
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

    getCurrentTime = currentTime => {
        this.setState({
            currentTime: currentTime
        })
    }

    handleTogglePlay = () => {
        this.setState({
            playing: !this.state.playing
        })
    }

    randomHSL = () => {
        const random = Math.floor(Math.random() * (360 - 10 + 1)) + 10
        return {
            bar: `hsla(${~~random},70%,60%,1)`,
            bubble: `hsla(${~~random},70%,80%,1)`
        }
    }

    handleSave = () => {
        const { dispatch, annotations, tags, toggle } = this.props

        if (toggle.id) {
            const ann = annotations.find(ann => ann.id === toggle.id)
            const tag = tags.find(tag => ann.tag === tag.name)
            dispatch(
                updateAnnotation({
                    id: toggle.id,
                    text: this.state.text,
                    start_time: this.state.start_time,
                    end_time: this.state.end_time,
                    tag: this.state.tag
                })
            )
            dispatch(
                addTag({
                    name: this.state.tag,
                    color: this.state.currentEditColor
                })
            )
            dispatch(
                deleteTag({
                    name: ann.tag
                })
            )
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
                    name: this.state.tag,
                    color: this.state.currentEditColor
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
        // find tag of annotation with this id
        let name = ''
        annotations.forEach(a => {
            if (a.id === toggle.id) name = a.tag
        })
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
        var i = 0
        for(; i < this.props.tags.length; i++) {
            if (this.props.tags[i].name == tag) {
                const curTag = this.props.tags[i]
                this.setState({
                    currentEditColor: curTag.color
                })
                break;
            }
        }
        if (i >= this.props.tags.length && tag !== '') {
            this.setState({
                currentEditColor: this.randomHSL()
            })
        }
        this.setState({
            tag: tag,
        })
    }

    handleUserAddTag = tag => {
        const { dispatch } = this.props
        dispatch(
            addTag({
                name: this.state.tag
            })
        )
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

    sec_toMS = time => {
        let curr = parseInt(time)
        let minutes = Math.floor(curr / 60)
        let seconds = curr - minutes * 60
        let min_str = minutes.toString()
        if (min_str.length < 2) min_str = '0' + min_str
        let sec_str = seconds.toString()
        if (sec_str.length < 2) sec_str = '0' + sec_str
        return { minutes: min_str, seconds: sec_str }
    }

    formatTime = time => {
        let curr = this.sec_toMS(time)
        return `${curr.minutes}:${curr.seconds}`
    }

    render() {
        const { name } = this.props.match.params
        return (
            <SongWrapper>
                <Waveform
                    src={'/jeneregretterien.mp3'}
                    isPlaying={this.state.playing}
                    currentTime={this.state.currentTime}
                    cursorTime={this.state.cursorTime}
                    regionColor={this.state.currentEditColor}
                    getCurrentTime={this.getCurrentTime}
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
                        handleUserAddTag={this.handleUserAddTag}
                        handleTextChange={this.handleTextChange}
                        start_time={this.state.start_time}
                        end_time={this.state.end_time}
                    />
                </Sidebar>

                <InteractiveButtonWrapper>
                    <Segment.Group horizontal>
                        <Segment>
                            <Button
                                icon
                                labelPosition="right"
                                onClick={() => {
                                    this.setState({
                                        annotationDrawerIsOpen: !this.state
                                            .annotationDrawerIsOpen
                                    })
                                }}
                            >
                                {this.state.annotationDrawerIsOpen
                                    ? 'Close Annotations'
                                    : 'Open Annotations'}
                                <Icon
                                    name={
                                        this.state.annotationDrawerIsOpen
                                            ? 'left arrow'
                                            : 'right arrow'
                                    }
                                />
                            </Button>
                            <Button
                                className="navBar"
                                content="Add Annotation"
                                onClick={() => {
                                    const { dispatch, toggle } = this.props
                                    dispatch(
                                        toggleAnnotation({
                                            isEditing: !toggle.isEditing,
                                            id: null
                                        })
                                    )
                                    this.setState({
                                        currentEditColor: this.randomHSL()
                                    })
                                }}
                            />
                        </Segment>
                        <Segment textAlign="center">
                            <Button
                                circular
                                icon={this.state.playing ? 'pause' : 'play'}
                                onClick={this.handleTogglePlay}
                            />
                            <Label>
                                Current Time:{' '}
                                {this.formatTime(this.state.currentTime)}
                            </Label>
                            <Label>
                                Cursor: {this.formatTime(this.state.cursorTime)}
                            </Label>
                        </Segment>
                        <Segment>
                            <Button
                                icon
                                labelPosition="left"
                                floated="right"
                                onClick={() => {
                                    this.setState({
                                        notesDrawerIsOpen: !this.state
                                            .notesDrawerIsOpen
                                    })
                                }}
                            >
                                {this.state.notesDrawerIsOpen
                                    ? 'Close Notes'
                                    : 'Open Notes'}
                                <Icon
                                    name={
                                        this.state.notesDrawerIsOpen
                                            ? 'right arrow'
                                            : 'left arrow'
                                    }
                                />
                            </Button>
                            <Button
                                className="navBar"
                                content="Add Note"
                                floated="right"
                            />
                        </Segment>
                    </Segment.Group>
                </InteractiveButtonWrapper>

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

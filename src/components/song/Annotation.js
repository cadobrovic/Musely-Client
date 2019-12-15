import React, { Component } from 'react'
import styled from 'styled-components'
import MiniWindowTime from './MiniWindowTime'
import { Button, Icon, Label} from 'semantic-ui-react'

import DotDotDot from 'react-dotdotdot'
import { connect } from 'react-redux'
import { toggleAnnotation, updateAnnotation } from '../../actions'
import 'semantic-ui-css/semantic.min.css'
import toggle from '../../reducers/toggle'

const Background = styled.div`
    position: relative;
    margin: 5px 5px 5px 5px;
    padding: 0.7rem 0.7rem 0.7rem 0.7rem;
    background-color: #eeeeee;
    /* box-shadow: 5px 5px 5px; */
    width: 20rem;
    height: 13rem;

    border-radius: 5px;
    ${props =>
        props.isSelected && {
            borderRadius: '3px',
            borderColor: props.color,
            borderStyle: 'solid'
        }}
`

const NoteHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0.2rem;
`

const TagWrapper = styled.div`
    height: auto;
    width: auto;
    margin-left: 0.5em;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 5px;
    background-color: ${props => props.color};
    border-radius: 2px;
`

const Tag = styled.div`
    margin: auto;
    font-size: 10px;
    font-weight: bold;
    color: white;
`

const NoteButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: absolute;
    bottom: 5px;
    right: 5px;
`

const TextDisplay = styled.div`
    font-size: 15px;
    height: 65%;
    width: 85%;
    margin: 0 auto;
    /* overflow:hidden; */
    /* white-space:nowrap; */
    /* text-overflow:ellipsis; */
`

class Annotation extends Component {
    handleEdit = () => {
        const { dispatch, id, toggle } = this.props
        dispatch(
            toggleAnnotation({
                isEditing: !toggle.isEditing,
                id: id
            })
        )
    }

    render() {
        const {
            isSelected,
            color,
            id,
            startTime,
            endTime,
            tag,
            tags,
            text
        } = this.props
        let tagColor = tags.find(t => t.name === tag).color

        return (
            <div>
                <Background
                    isSelected={isSelected}
                    color={tagColor.bubble || 'blue'}
                >
                    <NoteHeader>
                        <TagWrapper color={tagColor.bubble || 'blue'}>
                            <Tag>{tag}</Tag>
                        </TagWrapper>
                        <MiniWindowTime
                            start_time={startTime}
                            end_time={endTime}
                        />
                    </NoteHeader>
                    <TextDisplay>
                        <DotDotDot clamp={6}>
                            <p>{text}</p>
                        </DotDotDot>
                    </TextDisplay>
                    <NoteButtonContainer>
                        {/* <Popup
                            content="Add note to group"
                            trigger={<Button icon="add" />}
                        /> */}
                        <Button
                            icon
                            onClick={this.handleEdit}
                            size="mini"
                            labelPosition="right"
                        >
                            Edit
                            <Icon name="edit" />
                        </Button>
                    </NoteButtonContainer>
                </Background>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        toggle: state.toggle,
        tags: state.tags
    }
}

export default connect(mapStateToProps)(Annotation)

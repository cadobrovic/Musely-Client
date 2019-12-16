import React, { Component } from 'react'
import styled from 'styled-components'
import WindowTime from './WindowTime'
import '../nav/NavBar.css'
import {
    Button,
    Icon,
    TextArea,
    Form,
    Dropdown,
    Input,
    Label
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './EditAnnotation.css'
import { connect } from 'react-redux'
import uuid from 'uuid'

const EditAnnotationWrapper = styled.div`
    width: 95%;
    margin: auto;
    height: 22rem;
    /* border-radius: 10px; */
    border-width: 2px;
    border-color: black;
    /* background-color: rgb(161, 161, 161); */

    padding: 10px 10px 10px 10px;
`

const SideBySideWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 85%;
`

const TextFieldWrapper = styled.div`
    padding-bottom: 10px;
    width: 100rem;
    height: 100%;
`

const OptionsWrapper = styled.div`
    width: 100%;
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
`

const EditAnnotationTitle = styled.h2``

const OptionsText = styled.h2`
    width: auto;
`
const WindowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const TagsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 2.5em;
`

const ButtonWrapper = styled.div`
    position: absolute;
    bottom: 1rem;
    left: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 50%;
`

const DropDownBox = styled.div`
    margin-right: 5px;
    margin-left: 1.5em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
    height: auto;
`

class EditAnnotation extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
            tag: '',
            start_time: 0,
            end_time: 0,
            userTag: '',
            userPrimedTag: '',
            tagOptions: [
                { key: uuid.v4(), value: 'Favorites', text: 'Favorites' }
            ],
            // clearedValue: false
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { toggle } = nextProps
        if (!toggle.id && !toggle.isEditing) {
            this.setState({
                text: '',
                tag: {}
            })
        } else if (nextProps.annotations.length > 0) {
            if (
                nextProps.annotations.findIndex(
                    ann => nextProps.toggle.id === ann.id
                ) !== -1
            ) {
                console.log('++++++')
                console.log('TOGGLE ID', toggle.id)
                const idx = nextProps.annotations.findIndex(
                    ann => toggle.id === ann.id
                )
                console.log('INDEX', idx)
                const text = nextProps.annotations[idx].text
                const tag = nextProps.annotations[idx].tag
                console.log('TAG NAME TAG NAME TAG NAME', tag)
                this.setState({
                    text: text,
                    tag: tag
                })
            }
        }

        let newTags = []
        
        if (nextProps.tags.length > 0) {
            this.props.tags.forEach(tag => {
                const t = {
                    key: uuid.v4(),
                    value: tag.name,
                    text: tag.name
                }
                console.log('TTTTT', t)
                newTags.push(t)
            })
            if (this.state.userPrimedTag.length > 0) {
                console.log('USER PRIMED TAG CONCAT', this.state.userPrimedTag)
                newTags.concat(this.state.userPrimedTag)
            }
            console.log('NEW TAGS', newTags)
            this.setState({
                tagOptions: newTags
            })
        }

        

        this.setState({
            start_time: nextProps.start_time,
            end_time: nextProps.end_time
        })
    }
    

    handleTextChange = (e, data) => {
        const { handleTextChange } = this.props
        this.setState({
            text: e.target.value
        })
        handleTextChange(e.target.value)
    }

    handleTagChange = (e, data) => {
        console.log('HANDLE TAG CHANGE')
        const { handleTagChange } = this.props
        this.setState({
            tag: data.value
        })
        handleTagChange(data.value)
    }

    userAddTag = () => {
        console.log('&&&&&')
        const newTag = {
            key: uuid.v4(),
            value: this.state.userTag,
            text: this.state.userTag
        }
        this.setState({
            userPrimedTag: newTag,
            tagOptions: [...this.state.tagOptions, newTag]
        })
    }

    updateUserTag = (e, data) => {
        console.log('USER TAG UPDATED', data.value)
        this.setState({
            userTag: data.value
        })
    }

    saveAnnotation = () => {
        console.log('SAVE ANNOTATION')
        const { handleSave } = this.props
        this.setState({
            userPrimedTag: '',
            userTag: '',
            tagOptions: [
                { key: uuid.v4(), value: 'Favorites', text: 'Favorites' }
            ],
        })
        handleSave()
    }

    render() {
        const {
            handleSave,
            handleDiscard,
            handleTagChange,
            handleTextChange,
            handleTimeChange
        } = this.props

        let { start_time, end_time, annotations, toggle } = this.props

        const countryOptions = [
            { key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' },
            { key: 'al', value: 'al', flag: 'al', text: 'Albania' },
            { key: 'dz', value: 'dz', text: 'Algeria' },
            { key: 'as', value: 'as', text: 'American Samoa' },
            { key: 'df', value: 'dz', text: 'Algeria' },
            { key: 'zz', value: 'as', text: 'American Samoa' }
        ]

        return (
            <EditAnnotationWrapper>
                <EditAnnotationTitle>Edit Annotation</EditAnnotationTitle>
                <SideBySideWrapper>
                    <TextFieldWrapper>
                        <Form>
                            <TextArea
                                placeholder="Edit annotation here..."
                                value={this.state.text}
                                onChange={this.handleTextChange}
                                style={{
                                    height: 240,
                                    resize: 'none',
                                    paddingLeft: 20,
                                    paddingTop: 20,
                                    paddingRight: 20,
                                    paddingBottom: 20,
                                    fontSize: 20
                                }}
                            />
                        </Form>
                    </TextFieldWrapper>

                    <OptionsWrapper>
                        <WindowWrapper>
                            <OptionsText>Window</OptionsText>
                            <WindowTime
                                start_time={this.state.start_time}
                                end_time={this.state.end_time}
                            />
                        </WindowWrapper>

                        <TagsWrapper>
                            <OptionsText>Tag</OptionsText>
                            <DropDownBox>
                                <Dropdown
                                    placeholder="Add Tag"
                                    search
                                    selection
                                    clearable
                                    options={this.state.tagOptions}
                                    onChange={this.handleTagChange}
                                />
                                <Input
                                    label={
                                        <Button
                                            content="Add New Tag"
                                            onClick={this.userAddTag}
                                        />
                                    }
                                    labelPosition="right"
                                    placeholder="Type here..."
                                    onChange={this.updateUserTag}
                                />
                            </DropDownBox>
                        </TagsWrapper>

                        <ButtonWrapper>
                            <Button
                                size="huge"
                                animated
                                onClick={handleDiscard}
                            >
                                <Button.Content visible>Discard</Button.Content>
                                <Button.Content hidden>
                                    <Icon name="trash" />
                                </Button.Content>
                            </Button>

                            <Button
                                positive
                                className="navBar"
                                size="huge"
                                animated
                                onClick={this.saveAnnotation}
                            >
                                <Button.Content visible>Save</Button.Content>
                                <Button.Content hidden>
                                    <Icon name="save" />
                                </Button.Content>
                            </Button>
                        </ButtonWrapper>
                    </OptionsWrapper>
                </SideBySideWrapper>
            </EditAnnotationWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        annotations: state.annotations,
        tags: state.tags,
        toggle: state.toggle
    }
}

export default connect(mapStateToProps)(EditAnnotation)

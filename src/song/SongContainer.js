import React, { Component } from 'react'
import styled from 'styled-components'
import { Button, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import Note from './Note'
import Waveform from './MyWaveform'

const SongHeader = styled.h1`
	padding-left: 3rem;
	padding-top: 2rem;
	font-size: 50px;
	color: black;
`

const NoteContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	width: 95%;
	margin: auto;
`

const NotesOptionsButtonsContainer = styled.div`
	/* display: flex;
    flex-direction: row;
    text-align: right; */
	/* justify-content: flex-end;
    align-items: space-between; */
	position: relative;
	/* height: 5rem; */
	width: 95%;
	margin: auto;
	margin-bottom: 5rem;
`

const RightButtonsContainer = styled.div`
	position: absolute;
	right: 10px;
	display: flex;
	flex-direction: row;
`

const DropDownBox = styled.div`
	margin-right: 5px;
	margin-left: 5px;
`

class SongContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selected_groups: [],
			playing: false,
			pos: 0
		}
	}

	handleDropDownSelect = e => {
		console.log('EEEEEEE', e)
	}

	handlePosChange = e => {
		this.setState({
			pos: e.originalArgs[0]
		})
	}

	handleTogglePlay = () => {
		this.setState({
			playing: !this.state.playing
		})
	}

	handleSearchChange = (e, data) => {
		console.log(data.value)
		if (data.value.length > this.state.selected_groups.length)
			this.setState({
				selected_groups: [
					...this.state.selected_groups,
					data.value[data.value.length - 1]
				]
			})
		else {
			var array = [...this.state.selected_groups]
			var index = array.length - 1
			if (index !== -1) {
				array.splice(index, 1)
				this.setState({
					selected_groups: array
				})
			}
		}
	}

	render() {
		const notes_data = [
			{
				title: 'This Note',
				text:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus, cursus convallis aliquet enim enim in tincidunt.',
				time: '00:23-01:06'
			},
			{
				title: 'This Note',
				text: 'Lorem ipsum dolor sit amet.',
				time: '00:23-01:06'
			},
			{
				title: 'This Note',
				text: 'Lorem ipsum dolor sit amet.',
				time: '00:23-01:06'
			},
			{
				title: 'This Note',
				text: 'Lorem ipsum dolor sit amet.',
				time: '00:23-01:06'
			},
			{
				title: 'This Note',
				text: 'Lorem ipsum dolor sit amet.',
				time: '00:23-01:06'
			},
			{
				title: 'This Note',
				text: 'Lorem ipsum dolor sit amet.',
				time: '00:23-01:06'
			}
		]

		const notes = notes_data.map((elem, i) => {
			return (
				<Note
					key={i}
					title={elem.title}
					text={elem.text}
					time={elem.time}
				/>
			)
		})

		const { name } = this.props.match.params

		const countryOptions = [
			{ key: 'af', value: 'af', flag: 'af', text: 'Afghanistan' },
			{ key: 'ax', value: 'ax', flag: 'ax', text: 'Aland Islands' }
		]

		return (
			<div>
				<SongHeader>{name}</SongHeader>
				<Waveform
					src={`/${this.props.match.params.name}.mp3`}
					pos={this.state.pos}
					onPosChange={this.handlePosChange}
					playing={this.state.playing}
				/>
				<SongHeader>Notes</SongHeader>

				<NotesOptionsButtonsContainer>
					<RightButtonsContainer>
						<Button color="blue">Add Note</Button>
						<Button negative={true}>Remove Note</Button>
						<DropDownBox>
							<Dropdown
								placeholder="Display Group"
								search
								selection
								multiple
								options={group_options}
								onChange={this.handleSearchChange}
							/>
						</DropDownBox>

						<DropDownBox>
							<Dropdown
								placeholder="Sort by"
								item={true}
								search
								selection
								options={countryOptions}
							/>
						</DropDownBox>
					</RightButtonsContainer>
				</NotesOptionsButtonsContainer>
			</div>
		)
	}
}

export default SongContainer

// components/waveform.js
import React from 'react'
import ReactDOM from 'react-dom'
import WaveSurfer from 'wavesurfer.js'
import styled from 'styled-components'
import { Button, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
const WS = window.WaveSurfer

const WaveContainer = styled.div`
    width: 80%;
    margin: auto;
    height: 15rem;
    margin-bottom: 3rem;
`

const MediaControlsContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const ButtonBox = styled.div`
    width: 4rem;
`

const TimeBox = styled.div`
    width: 10rem;
    display: inline;
`

const Time = styled.span`
    font-size: 20px;
    padding: 5px;
`

class Waveform extends React.Component {
    constructor(props) {
        super(props)
        this.wavesurfer = null
        this.handleRegion = this.handleRegion.bind(this)
        this.state = {
            regionExists: false,
            curColor: ''
        }
    }

    componentDidMount() {
        this.wavesurfer = this.buildWave()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { toggle, handleCursor, currentTime, annotations, isPlaying, regionColor } = nextProps
        let convertedColor = 'hsla(211, 96%, 72%, 0.5)'
        let isNewColor = false
        if (regionColor) convertedColor = this.convertColor(regionColor)
        if (convertedColor.localeCompare(this.state.curColor) !== 0) {
            isNewColor = true
            this.setState({
                curColor: convertedColor
            })
        }
        isPlaying ? this.wavesurfer.play() : this.wavesurfer.pause()
        const idx = this.findIndex(toggle.id, annotations)
        let start_time = currentTime
        let end_time = currentTime + 10
        if (idx !== -1) {
            start_time = annotations[idx].start_time
            end_time = annotations[idx].end_time
        }
        if (toggle.isEditing && !this.state.regionExists) {
            this.buildEditableRegion({
                start_time: start_time,
                end_time: end_time,
                color: convertedColor
            })
            handleCursor({
                currentTime: currentTime,
                region: this.state.regionExists
            })
        } else if (toggle.isEditing && this.state.regionExists && isNewColor) {
            this.wavesurfer.clearRegions()
            this.buildEditableRegion({
                start_time: start_time,
                end_time: end_time,
                color: convertedColor
            })
            handleCursor({
                currentTime: currentTime,
                region: this.state.regionExists
            })
        } else if (!toggle.isEditing) {
            this.wavesurfer.clearRegions()
            this.setState({
                regionExists: false
            })
        }
    }

    findIndex(id, annotations) {
        return annotations.findIndex(ann => ann.id === id)
    }

    buildWave() {
        const el = ReactDOM.findDOMNode(this)
        const waveform = el.querySelector('#wave')
        const wavesurfer = WaveSurfer.create({
            container: waveform,
            waveColor: 'grey',
            progressColor: 'black',
            height: 200,
            barHeight: 1,
            barWidth: 1,
            cursorWidth: 3,
            scrollParent: false,
            responsive: true,
            plugins: [
                WS.regions.create({
                    regions: []
                }),
                WS.cursor.create({
                    opacity: 5
                }),
                WS.timeline.create({
                    container: '#wave-timeline',
                    height: 30,
                    notchPercentHeight: 50,
                    primaryColor: '#010103',
                    secondaryColor: 'green'
                })
            ]
        })

        wavesurfer.load(this.props.src)

        // Passing duration to SongContainer
        wavesurfer.on('ready', () => {
            const { getSongDuration } = this.props
            getSongDuration(wavesurfer.getDuration())
        })

        waveform.addEventListener('mousemove', event => {
            const { handleCursorMove } = this.props
            let cursorTime =
                ((event.pageX - waveform.offsetLeft) / waveform.clientWidth) *
                wavesurfer.getDuration()
            handleCursorMove(cursorTime)
        })

        wavesurfer.on('region-updated', this.handleRegion)
        wavesurfer.on('audioprocess', () => {
            const { getCurrentTime } = this.props
            getCurrentTime(wavesurfer.getCurrentTime())
        })

        waveform.addEventListener('click', () => {
            const { handleCursor } = this.props
            this.setState({
                currentTime: wavesurfer.getCurrentTime()
            })
            setTimeout(() => {
                const currentTime = wavesurfer.getCurrentTime()
                handleCursor({
                    currentTime: currentTime,
                    region: this.state.regionExists
                })
            }, 20)
        })
        return wavesurfer
    }

    handleRegion = e => {
        const { handleRegion } = this.props
        if (e.start + 3 < e.end) {
            handleRegion(e)
        } else {
            handleRegion({ start: 0, end: 0 })
            this.wavesurfer.clearRegions()
            this.setState({
                regionExists: false
            })
        }
    }

    handlePlay = () => {
        this.wavesurfer.play()
    }

    handlePause = () => {
        this.wavesurfer.pause()
    }

    convertColor = (hsla1) => {
        var bar = hsla1.bar
        const lastComma = bar && bar.lastIndexOf(",")
        const half = bar.substring(0, lastComma).concat(',0.5)')
        return half
    }

    buildEditableRegion = ({
        start_time = 0,
        end_time = 10,
        color = 'hsla(211, 96%, 72%, 0.5)'
    }) => {
        this.wavesurfer.clearRegions()
        this.setState({
            regionExists: true
        })
        this.wavesurfer.addRegion({
            id: 0,
            start: start_time,
            end: end_time,
            color: color
        })
    }

    //buildRegionsByTag = ({ tag = null }) => {
    //const { annotations } = this.props
    //this.wavesurfer.clearRegions()
    //annotations.forEach(ann => {
    //if (ann.tag === tag) {
    //this.wavesurfer.addRegion({
    //id: ann.id,
    //start: ann.start_time,
    //end: ann.end_time,
    //drag: false,
    //resize: false,
    //color: ann.color || 'rgba(101, 145, 202, 0.87)'
    //})
    //}
    //})
    //}

    // sec_toMS = time => {
    //     let curr = parseInt(time)
    //     let minutes = Math.floor(curr / 60)
    //     let seconds = curr - minutes * 60
    //     let min_str = minutes.toString()
    //     if (min_str.length < 2) min_str = '0' + min_str
    //     let sec_str = seconds.toString()
    //     if (sec_str.length < 2) sec_str = '0' + sec_str
    //     return { minutes: min_str, seconds: sec_str }
    // }

    // formatTime = time => {
    //     let curr = this.sec_toMS(time)
    //     return `${curr.minutes}:${curr.seconds}`
    // }

    render() {
        // const { currentTime, cursorTime, handleCursor, toggle } = this.props

        return (
            <WaveContainer>
                <div id="wave-timeline"></div>
                <div id="wave" style={{ position: 'relative' }}></div>
                {/* <MediaControlsContainer>
                    <ButtonBox>
                        <Button
                            icon
                            color="green"
                            fluid
                            onClick={this.handlePlay}
                        >
                            <Icon name="play" />
                        </Button>
                    </ButtonBox>
                    <ButtonBox>
                        <Button
                            icon
                            color="red"
                            fluid
                            onClick={this.handlePause}
                        >
                            <Icon name="pause" />
                        </Button>
                    </ButtonBox>
                    <TimeBox>
                        <Time>current:</Time>
                        <Time>{this.formatTime(currentTime)}</Time>
                    </TimeBox>
                    <TimeBox>
                        <Time>cursor:</Time>
                        <Time>{this.formatTime(cursorTime)}</Time>
                    </TimeBox>
                </MediaControlsContainer> */}
            </WaveContainer>
        )
    }
}

Waveform.defaultProps = {
    src: ''
}

const mapStateToProps = state => {
    return {
        annotations: state.annotations,
        toggle: state.toggle
    }
}

export default connect(mapStateToProps)(Waveform)

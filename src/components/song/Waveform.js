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
            regionExists: false
        }
    }

    componentDidMount() {
        this.wavesurfer = this.buildWave()
    }

    buildWave() {
        const el = ReactDOM.findDOMNode(this)
        const waveform = el.querySelector('#wave')
        const wavesurfer = WaveSurfer.create({
            container: waveform,
            waveColor: 'grey',
            progressColor: 'black',
            height: 200,
            barHeight: 8,
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
                })
            ]
        })

        wavesurfer.load(this.props.src)
        waveform.addEventListener('mousemove', event => {
            const { handleCursorMove } = this.props
            debugger
            let cursorTime =
                ((event.pageX - waveform.offsetLeft) / waveform.clientWidth) *
                wavesurfer.getDuration()
            handleCursorMove(cursorTime)
        })
        waveform.addEventListener('click', () => {
            const { handleCursor, handlePlay } = this.props
            this.setState({
                currentTime: wavesurfer.getCurrentTime()
            })
            wavesurfer.on('region-updated', this.handleRegion)
            wavesurfer.on('audioprocess', () =>
                handlePlay(wavesurfer.getCurrentTime())
            )
            setTimeout(() => {
                const currentTime = wavesurfer.getCurrentTime()
                if (!this.state.regionExists) {
                    this.buildEditableRegion({
                        start_time: currentTime,
                        end_time: currentTime + 10
                    })
                    this.setState({
                        regionExists: true
                    })
                }
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
        const currentTime = this.wavesurfer.getCurrentTime()
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

    handleHover = () => {}

    handlePlay = () => {
        this.wavesurfer.play()
    }

    handlePause = () => {
        this.wavesurfer.pause()
    }

    buildEditableRegion = ({
        start_time = 0,
        end_time = 10,
        color = 'blue'
    }) => {
        this.wavesurfer.clearRegions()
        this.wavesurfer.addRegion({
            id: 0,
            start: start_time,
            end: end_time,
            color: color
        })
    }

    buildRegionsByTag = ({ tag = null }) => {
        const { annotations } = this.props
        this.wavesurfer.clearRegions()
        annotations.map(ann => {
            if (ann.tag === tag) {
                this.wavesurfer.addRegion({
                    id: ann.id,
                    start: ann.start_time,
                    end: ann.end_time,
                    drag: false,
                    resize: false,
                    color: ann.color || 'rgba(101, 145, 202, 0.87)'
                })
            }
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
        const { currentTime, cursorTime } = this.props
        return (
            <WaveContainer>
                <div id="wave" style={{ position: 'relative' }}></div>
                <MediaControlsContainer>
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
                </MediaControlsContainer>
            </WaveContainer>
        )
    }
}

Waveform.defaultProps = {
    src: ''
}

const mapStateToProps = state => {
    return {
        annotations: state.annotations
    }
}

export default connect(mapStateToProps)(Waveform)

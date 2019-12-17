import React, { Component } from 'react'
import './NavBar.css'
import styled from 'styled-components'
import { Button, Menu, Container, Input, MenuItem } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const largeText = {
    height: '85px',
    fontSize: '2rem'
}
const largerText = {
    fontSize: '2rem',
    color: 'white'
}
const searchBar = {
    marginTop: '20px',
    height: '50px'
}

class NavBar extends Component {
    constructor(props) {
        super(props)

        this.state = { activeItem: 'home' }
    }

    render() {
        const { activeItem } = this.state
        const { song } = this.props
        return (
            <div style={{ marginBottom: '0px' }}>
                <Menu inverted className="navBar" pointing style={largeText}>
                    <Menu.Item name="home" active={activeItem === 'home'}>
                        <Link to="/library">Musely</Link>
                    </Menu.Item>
                    <MenuItem style={largerText}>{song || 'Non, je ne regrette rien'}</MenuItem>
                    <Menu.Menu position="right">
                        <Input
                            style={searchBar}
                            action={{ type: 'submit', content: 'Go' }}
                            placeholder="Search for Songs..."
                        />
                        <Menu.Item name="login" active={activeItem === 'login'}>
                            <Link to="/login">Login</Link>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return { song: state.song }
}

export default connect(mapStateToProps)(NavBar)

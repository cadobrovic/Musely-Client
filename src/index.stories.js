import React from 'react'
import styled from 'styled-components'

const Bar = styled.div`
    width: 100%;
    height: 4rem;
    background-color: grey;
    display: flex;
    align-items: center;
`

const Item = styled.div`
    flex-grow: 1;
    text-align: center;
    font-size: 20px;
`

export default {
    title: 'Edit Annotation'
}

export const songBar = () => (
    <Bar>
        <Item> Hello </Item>
        <Item> Hello </Item>
    </Bar>
)

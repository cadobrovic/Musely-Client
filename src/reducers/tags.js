const tags = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TAG':
            if (state.findIndex(tag => tag.name === action.name) === -1) {
                return [
                    ...state,
                    {
                        count: 1,
                        color: action.color,
                        name: action.name
                    }
                ]
            }
            return state.map(tag => {
                if (tag.name === action.name) {
                    return {
                        count: ++tag.count,
                        color: tag.color,
                        name: action.name
                    }
                }
                return tag
            })
        case 'DELETE_TAG':
            return state
                .map(tag => {
                    if (tag.name === action.name) {
                        return {
                            name: tag.name,
                            color: tag.color,
                            count: --tag.count
                        }
                    }
                    return tag
                })
                .filter(tag => tag.count > 0)
        default:
            return state
    }
}

export default tags

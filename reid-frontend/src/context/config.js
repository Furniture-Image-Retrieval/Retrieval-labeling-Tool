export const setSelfReidConfig = (value) => {
    localStorage.setItem("selfReid", value)
}

export const getSelfReidConfig = () => {
    if (localStorage.getItem("selfReid") === "true") {
        return true
    } 
    else {
        return false
    }
}


export const setNextInProgressCheckedConfig = (value) => {
    localStorage.setItem("nextInProgresschecked", value)
}

export const getNextInProgressCheckedConfig = () => {
    if (localStorage.getItem("nextInProgresschecked") === "true") {
        return true
    } 
    else {
        return false
    }
}
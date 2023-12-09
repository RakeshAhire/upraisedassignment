

const getLocalStorage = (key) => {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return data;
    } catch (error) {
        return null
    }
}

const setLocalStorage = (key, value) => {
    const data = localStorage.setItem(key, JSON.stringify(value));
    return data;
}

const clearLocalStorage = (key) => {
    const data = localStorage.removeItem(key);
    return data;
}

export { getLocalStorage, setLocalStorage,clearLocalStorage }
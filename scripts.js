// Global Variables
let predicted = undefined;


// Get saved list from local storage
const getListFromLS = () => {
    const list = localStorage.getItem('list');
    const listArray = JSON.parse(list);
    if (listArray) {
        return listArray;
    }
    return undefined;
}

const submitForm = () => {
    const error = document.getElementById('error');
    const savedContainer = document.getElementById('saved-container');
    const savedName = document.getElementById('savedAnwer');
    error.style.display = 'none';
    savedContainer.style.display = 'none';
    const { value } = document.getElementById('name-input');
    const radioValue = document.querySelector('input[name="select-gender"]:checked');
    if (value === '') {
        error.style.display = 'block';
        return;
    }
    const list = getListFromLS();
    if (list) {
        const searchedName = list.find(item => item.name === value);
        if (searchedName) {
            savedName.innerHTML = searchedName.gender;
            savedContainer.style.display = 'flex';
            const clearButton = document.getElementById('clear-button');
            clearButton.addEventListener('click', () => {
                clearItem(value);
            })
        }
    }
    getPrediction(value);
    if (radioValue) {
        radioValue.checked = false;
    }
}

const saveForm = async () => {
    let genderValue = undefined;
    const success = document.getElementById('success');
    const { value } = document.getElementById('name-input');
    const radioValue = document.querySelector('input[name="select-gender"]:checked');
    success.style.display = 'none';
    if (value === '') {
        error.style.display = 'block';
        return;
    }
    if (!radioValue) {
        if (!predicted) {
            error.style.display = 'block';
            return;
        } else {
            genderValue = predicted.gender ? predicted.gender : undefined;
        }
    } else {
        genderValue = radioValue.value;
    }

    if (!genderValue) {
        error.style.display = 'block';
        return;
    }
    const doc = {
        name: value,
        gender: genderValue,
    }
    const list = getListFromLS();
    if (!list) {
        localStorage.setItem('list', JSON.stringify([doc]));
        return;
    }
    const isIncludedIndex = list.findIndex(item => item.name === value);
    if (isIncludedIndex > -1) {
        list.splice(isIncludedIndex, 1);
    }
    list.push({ 
        name: value,
        gender: genderValue, 
    })
    localStorage.setItem('list', JSON.stringify(list));
    error.style.display = 'none';
    if (radioValue) {
        success.style.display = 'block';
        radioValue.checked = false;
    }
}


const getPrediction = async (value) => {
    if (value === '') {
        error.style.display = 'block';
        return;
    }
    const url = `https://api.genderize.io/?name=${value}`;
    let response = await fetch(url);
    let data = await response.json();
    const responseObject = {
        name: data.name,
        gender: data.gender,
        probability: data.probability,
    }
    predicted = responseObject;
    const genderView = document.getElementById('predictedGender');
    const probabilityView = document.getElementById('predictedProbability');
    genderView.innerHTML = responseObject.gender;
    probabilityView.innerHTML = responseObject.probability.toString();
}

// Clear saved item from local storage
const clearItem = (value) => {
    const list = getListFromLS();
    if (list) {
        const currentIndex = list.findIndex(item => item.name === value);
        if (currentIndex > -1) {
            list.splice(currentIndex, 1);
            localStorage.setItem('list', JSON.stringify(list));
            const savedContainer = document.getElementById('saved-container');
            savedContainer.style.display = 'none';
        }
    }
}
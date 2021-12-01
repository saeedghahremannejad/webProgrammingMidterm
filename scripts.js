const submitForm = () => {
    const error = document.getElementById('error');
    error.style.display = 'none';
    const { value } = document.getElementById('name-input');
    const radioValue = document.querySelector('input[name="select-gender"]:checked');
    if (value === '' || !radioValue) {
        error.style.display = 'block';
        return;
    }
    console.log(value, radioValue.value);
}
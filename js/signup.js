/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/

"use strict";

function onReady () {
    var signUp = document.getElementById('signup');
    var stateSelect = signUp.elements['state'];
    var idx;
    var option;
    var state;

    for (idx = 0; idx < usStates.length; ++idx) {
        option = document.createElement('option');
        state = usStates[idx];
        option.value = state.code;
        option.innerHTML = state.name;
        stateSelect.appendChild(option);
    }

    var occSelect = document.getElementById('occupation');
    var selOther = signUp.elements['occupationOther'];
    occSelect.addEventListener('change', function () {
        if (occSelect.value == 'other') {
            selOther.style.display = 'block';
        }
        else {
            selOther.value = "";
            selOther.style.display = 'none';
        }
    });

    var exitButton = document.getElementById('cancelButton');
    exitButton.addEventListener('click', function () {
       if (window.confirm("Are you sure you want to leave?")) {
           window.location = 'http://google.com';
       }
    });

    signUp.addEventListener('submit', onSubmit);
}

document.addEventListener('DOMContentLoaded', onReady);

function onSubmit (evt) {
    var valid = validateForm(this);

    if (!valid) {
        var errMsg = document.getElementById('error-message');
        errMsg.innerHTML = 'Please provide values for all required fields.';
        errMsg.style.display = 'block';
    }

    if (!valid && evt.preventDefault) {
        evt.preventDefault();
    }

    evt.returnValue = valid;
    return valid;
}

function validateForm (form) {
    var reqFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'birthdate'];
    var idx;
    var valid = true;

    for (idx = 0; idx < reqFields.length; ++idx) {
        valid &= validateReqField(form.elements[reqFields[idx]]);
    }

    var occSelect = document.getElementById('occupation');
    var selOther = form.elements['occupationOther'];
    if (occSelect.value == 'other') {
        validateReqField (selOther.value);
    }

    testZip();

    var dob = form.elements['birthdate'].value;
    var age = calculateAge(dob);
    if (age < 13) {
        displayAge();
    }

    return valid;
}

function validateReqField (field) {
    var value = field.value;
    value = value.trim();
    var valid = value.length > 0;

    if (valid) {
        field.className = 'form-control';
    }
    else {
        field.className = 'form-control invalid-field';
    }

    return valid;
}

function calculateAge (dob) {
    if (!dob) {
        throw new Error ('Please enter your birth date.');
    }

    dob = new Date(dob);
    var today = new Date();

    var yearsDiff = today.getFullYear() - dob.getUTCFullYear();
    var monthsDiff = today.getMonth() - dob.getUTCMonth();
    var daysDiff = today.getDate() - dob.getUTCDate();

    if (monthsDiff < 0 || (0 == monthsDiff && daysDiff < 0)) {
        yearsDiff--;
    }

    return yearsDiff;
}

function testZip () {
    var zipRegExp = new RegExp('^\\d{5}$');
    var zipDigits = document.getElementById('zip');

    if (!zipRegExp.test(zipDigits)) {
        var zipMsg = ('Zip code incorrect, please enter only 5 digits.');
        displayError (zipMsg);
    }
}

function displayAge () {
    var ageMsg = 'You must be 13 or older to sign up.';
    displayError(ageMsg);
}

function displayError (error) {
    displayMessage (error, true);
}

function displayMessage (message, isError) {
    var msg = document.getElementById('birthdateMessage');
    msg.innerHTML = message;
    msg.className = isError ? 'alert alert-danger' : 'alert alert-success';
    msg.style.display = 'block';
}


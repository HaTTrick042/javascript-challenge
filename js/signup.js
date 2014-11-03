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
       valid &= validateReqField (selOther);
    }
    valid &= testZip(form.elements['zip']);

    var dob = form.elements['birthdate'];
    var age = calculateAge(dob.value);
    if (age < 13) {
        valid &= false;
        dob.className = 'form-control invalid-field';
        displayAgeError(false);
    }
    else {
        console.log('hi');
        displayAgeError(true);
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

function testZip (zip) {
    var zipRegExp = new RegExp('^\\d{5}$');
    var valid = zipRegExp.test(zip.value);

    if (valid) {
        zip.className = 'form-control';
    }
    else {
        zip.className = 'form-control invalid-field';
    }
    return valid;
}

function displayAgeError (valid) {
    var ageMsg = 'You must be 13 or older to sign up.';
    var msg = document.getElementById('birthdateMessage');
    msg.innerHTML = ageMsg;
    console.log(valid);
    if (!valid) {
        msg.style.display = 'block';
    }
    else {
        msg.style.display = 'none';
    }
    console.log(msg.style.display);
}


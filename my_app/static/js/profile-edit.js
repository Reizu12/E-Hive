document.addEventListener('DOMContentLoaded', function () {
    
    var profileForm = document.getElementById("profileForm");
    var profilePictureForm = document.getElementById("profilePictureForm");
    var profilePictureInput = document.getElementById('profilePictureInput');
    var profilePicturePreview = document.getElementById('profilePicturePreview');
    const initialProfilePicture = profilePicturePreview.src;

    
    var saveChangesBtn = document.getElementById("saveChangesBtn");
    var discardChangesBtn = document.getElementById("discard");
    var confirmSaveBtn = document.getElementById("confirmSaveChangesBtn");
    var confirmDiscardBtn = document.getElementById("confirmDiscard");

    
    var modal2 = document.getElementById("myModal2");
    var modal3 = document.getElementById("myModal3");
    var modal4 = document.getElementById("myModal4");

    var closePassModalBtn = document.getElementById("close5");
    var confirmPassBtn = document.getElementById("confirmPassChange");
    var changePassBtn = document.getElementById("c_pass");

    const initialFormData = new FormData(profileForm);
    let isFormChanged = false;

    
    function toggleSaveDiscardButtons(show) {
        saveChangesBtn.style.visibility = show ? "visible" : "hidden";
        discardChangesBtn.style.visibility = show ? "visible" : "hidden";
    }

    toggleSaveDiscardButtons(false);

    
    profileForm.addEventListener('input', function () {
        isFormChanged = hasFormChanged();
        toggleSaveDiscardButtons(isFormChanged);
    });

    function hasFormChanged() {
        const currentFormData = new FormData(profileForm);
        for (const [key, value] of currentFormData.entries()) {
            if (initialFormData.get(key) !== value) {
                return true;
            }
        }
        return false;
    }

    
    profilePictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePicturePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
            toggleSaveDiscardButtons(true);
        } else {
            alert('Only .jpg, .jpeg, or .png files are allowed.');
        }
    });

    
    confirmSaveBtn.addEventListener("click", function () {
        let profileValid = profileForm.checkValidity();
        let pictureValid = profilePictureInput.files.length > 0;

        if (profileValid || pictureValid) {
            if (profileValid) {
                profileForm.submit();
            }
            if (pictureValid) {
                submitProfilePicture();
            }
            modal2.style.display = "none";
            toggleSaveDiscardButtons(false);
        } else {
            alert('Please fill in all the required fields or select a profile picture.');
        }
    });

    
    function submitProfilePicture() {
        const formData = new FormData(profilePictureForm);

        fetch(profilePictureForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); 
            }
            throw new Error('Failed to upload profile picture.');
        })
        .then(data => {
            if (data.success) {
                alert('Profile picture updated successfully.');
            } else {
                alert('Failed to update profile picture. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the profile picture.');
        });
    }

    
    confirmDiscardBtn.addEventListener("click", function () {
        profileForm.reset();
        profilePictureForm.reset();
        profilePicturePreview.src = initialProfilePicture;

        modal4.style.display = "none";
        toggleSaveDiscardButtons(false);
    });

    
    modal4.querySelector('.cancel4').addEventListener("click", function () {
        modal4.style.display = "none";
    });

    modal2.querySelector('.cancel2').addEventListener("click", function () {
        modal2.style.display = "none";
    });

    
    discardChangesBtn.addEventListener("click", function () {
        modal4.style.display = "flex";
    });

    
    saveChangesBtn.addEventListener("click", function () {
        modal2.style.display = "flex";
    });


    const deleteProfileBtn = document.getElementById('deleteProfile');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteProfileBtn = document.getElementById('confirmDeleteProfile');

    deleteProfileBtn.addEventListener('click', () => {
        deleteModal.style.display = 'flex';
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    confirmDeleteProfileBtn.addEventListener('click', () => {
        fetch('/delete_profile/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Your profile has been successfully deleted.');
                window.location.href = '/';
            } else {
                alert(`Failed to delete profile: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting your profile.');
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });

    // --- CHANGE PASSWORD ---
    changePassBtn.addEventListener('click', () => {
        modal3.style.display = 'flex';
    });

    closePassModalBtn.addEventListener('click', () => {
        modal3.style.display = 'none';
    });

    confirmPassBtn.addEventListener('click', () => {
        const passwordForm = document.getElementById('passwordForm');
        const formData = new FormData(passwordForm);

        fetch('/change_password/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password changed successfully.');
                modal3.style.display = 'none';
            } else {
                alert(`Failed to change password: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while changing the password.');
        });
    });
});
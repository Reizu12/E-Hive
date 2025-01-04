document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('modalOverlay');
  const openModalButton = document.getElementById('openModalButton');
  const closeModalButton = document.getElementById('closeModalButton');

  const selectedStatus = document.getElementById("selectedStatus");
  const statusOptions = document.getElementById("statusOptions");
  const statusItems = document.querySelectorAll(".status-option");

  const selectedPriority = document.querySelector('#selectedPriority');
  const priorityOptions = document.querySelector('#priorityOptions');
  const priorityItems = document.querySelectorAll('.priority-option2');


  const bannerPreview = document.querySelector('.banner-preview');
  const bannerOptions = document.querySelector('.banner-options');
  const bannerOptionImages = document.querySelectorAll('.banner-option');


  const input = document.getElementById("pmember");
  const memberList = document.getElementById("memberList");

  openModalButton.addEventListener('click', () => {
    modalOverlay.classList.add('show');
  });

  closeModalButton.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
  });

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.classList.remove('show');
    }
  });


  selectedStatus.addEventListener("click", () => {
    statusOptions.style.display =
      statusOptions.style.display === "block" ? "none" : "block";
  });

  statusItems.forEach((item) => {
    item.addEventListener("click", () => {
      const statusValue = item.getAttribute("data-value");
      const statusClass = item.classList[1]; 

      selectedStatus.textContent = item.textContent;
      selectedStatus.className = `selected-option ${statusClass}`;

      statusOptions.style.display = "none";
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".status-dropdown")) {
      statusOptions.style.display = "none";
    }
  });


  selectedPriority.addEventListener("click", () => {
    priorityOptions.style.display =
      priorityOptions.style.display === "block" ? "none" : "block";
  });

  priorityItems.forEach((item) => {
    item.addEventListener("click", () => {
      const priorityValue = item.getAttribute("data-value");
      const priorityClass = item.classList[1];

      selectedPriority.textContent = item.textContent;
      selectedPriority.className = `selected-option ${priorityClass}`;

      priorityOptions.style.display = "none";
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".priority-dropdown")) {
      priorityOptions.style.display = "none";
    }
  });



  input.addEventListener("focus", () => {
      memberList.classList.add("show");
  });

  input.addEventListener("input", () => {
      const searchValue = input.value.toLowerCase();
      const members = memberList.querySelectorAll(".member-item");
      members.forEach(member => {
          const name = member.innerText.toLowerCase();
          if (name.includes(searchValue)) {
              member.style.display = "flex";
          } else {
              member.style.display = "none";
          }
      });
  });

  document.addEventListener('click', function (event) {
    if (!input.contains(event.target) && !memberList.contains(event.target)) {
        memberList.classList.remove("show");  
    }
  });

  document.addEventListener("click", (e) => {
      if (!e.target.closest(".form-group")) {
          memberList.classList.remove("show");
      }
  });

  const memberItems = document.querySelectorAll(".member-item");
  memberItems.forEach(item => {
      item.addEventListener("click", () => {
          input.value = item.querySelector("span").innerText;
          memberList.classList.remove("show");
      });
  });



  bannerPreview.addEventListener('click', function () {
    if (bannerOptions.style.display === 'none' || bannerOptions.style.display === '') {
        bannerOptions.style.display = 'flex';
    } else {
        bannerOptions.style.display = 'none';
    }
  });

  bannerOptionImages.forEach(function (bannerOption) {
      bannerOption.addEventListener('click', function () {
          const selectedBannerSrc = bannerOption.src;
          const previewImage = bannerPreview.querySelector('img');
          previewImage.src = selectedBannerSrc;
          bannerOptions.style.display = 'none'; 
      });
  });

  document.addEventListener('click', function (event) {
    if (!bannerPreview.contains(event.target) && !bannerOptions.contains(event.target)) {
        bannerOptions.style.display = 'none';  
    }
  });


  const createTaskButton = document.querySelector('.btn-pri');

});


function addNewProject() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // collect input
  const projectName = document.getElementById('projectName');
  const projectDescription = document.getElementById('description');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const projectStatus = document.getElementById('selectedStatus');
  const projectPriority = document.getElementById('selectedPriority');

  // Reset Red Borders
  [projectName, startDate, endDate, projectStatus, projectPriority].forEach(input => {
    input.style.border = '';
  });

  let isValid = true;

  // required data
  if (!projectName.value.trim()) {
    projectName.style.border = '2px solid red';
    isValid = false;
  }
  if (!startDate.value.trim()) {
    startDate.style.border = '2px solid red';
    isValid = false;
  }
  if (!endDate.value.trim()) {
    endDate.style.border = '2px solid red';
    isValid = false;
  }
  if (!projectStatus.textContent.trim()) {
    projectStatus.style.border = '2px solid red';
    isValid = false;
  }
  if (!projectPriority.textContent.trim()) {
    projectPriority.style.border = '2px solid red';
    isValid = false;
  }

  // date validation
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (end < start) {
    startDate.style.border = '2px solid red';
    endDate.style.border = '2px solid red';
    alert('End date must not precede the start date.');
    isValid = false;
  }

  if (!isValid) {
    alert('Please fill out all required fields correctly (Description is optional).');
    return;
  }

  // data cleaning
  const data = {
    project_name: projectName.value.trim(),
    project_description: projectDescription.value.trim(),
    start_date: startDate.value.trim(),
    end_date: endDate.value.trim(),
    project_status: projectStatus.textContent.trim().replace(/\s+/g, '_').replace(/-/g, '_').toUpperCase(),
    project_priority: projectPriority.textContent.trim().replace(/\s+/g, '_').toUpperCase()
  };

  console.log('Project Data:', data);

  fetch(`/create-project/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Project created successfully!');
        modalOverlay.style.display = 'none';
        // refresh 
        location.reload();
      } else {
        alert('Error creating project: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while creating the project.');
    });
}

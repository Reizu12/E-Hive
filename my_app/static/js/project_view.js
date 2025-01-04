document.addEventListener('DOMContentLoaded', () => {

  const modalOverlay2 = document.getElementById('modalOverlay2');
  const openModalButton2 = document.getElementById('openModalButton2');
  const closeModalButton2 = document.getElementById('closeModalButton2');
  
  const modalOverlay = document.getElementById('modalOverlay');
  const openModalButton = document.getElementById('openModalButton');
  const closeModalButton = document.getElementById('closeModalButton');

  const closeModalButtonEdit = document.getElementById('closeModalButtonEdit');
  
  const selectedStatus = document.getElementById("selectedStatus");
  const statusOptions = document.getElementById("statusOptions");
  const statusItems = document.querySelectorAll(".status-option");
  
  const selectedStatus2 = document.getElementById("selectedStatus2");
  const statusOptions2 = document.getElementById("statusOptions2");
  const statusItems2 = document.querySelectorAll(".status-option2");

  const selectedStatusEdit = document.getElementById("selectedStatusEdit");
  const statusOptionsEdit = document.getElementById("statusOptionsEdit");
  const statusItemsEdit = document.querySelectorAll(".status-option-edit");
  
  const selectedPriority = document.querySelector('#selectedPriority');
  const priorityOptions = document.querySelector('#priorityOptions');
  const priorityItems = document.querySelectorAll('.priority-option');
  
  const selectedPriority2 = document.querySelector('#selectedPriority2');
  const priorityOptions2 = document.querySelector('#priorityOptions2');
  const priorityItems2 = document.querySelectorAll('.priority-option2');
  
  const selectedPriorityEdit = document.querySelector('#selectedPriorityEdit');
  const priorityOptionsEdit = document.querySelector('#priorityOptionsEdit');
  const priorityItemsEdit = document.querySelectorAll('.priority-option-edit');
  
  const bannerPreview = document.querySelector('.banner-preview');
  const bannerOptions = document.querySelector('.banner-options');
  const bannerOptionImages = document.querySelectorAll('.banner-option');

  const input = document.getElementById("pmember");
  const memberList = document.getElementById("memberList");
  const input2 = document.getElementById("pmember2");
  const memberList2 = document.getElementById("memberList2");
  
// Edit Task Priority
selectedPriorityEdit.addEventListener("click", () => {
  priorityOptionsEdit.style.display =
  priorityOptionsEdit.style.display === "block" ? "none" : "block";
});

priorityItemsEdit.forEach((item) => {
  item.addEventListener("click", () => {
    const priorityValue = item.getAttribute("data-value");
    const priorityClass = item.classList[1];

    selectedPriorityEdit.textContent = item.textContent;
    selectedPriorityEdit.className = `selected-option ${priorityClass}`;

    priorityOptionsEdit.style.display = "none";
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".priority-dropdown")) {
    priorityOptionsEdit.style.display = "none";
  }
});

// Edit Status Priority
selectedStatusEdit.addEventListener("click", () => {
  statusOptionsEdit.style.display =
    statusOptionsEdit.style.display === "block" ? "none" : "block";
});

statusItemsEdit.forEach((item) => {
  item.addEventListener("click", () => {
    const statusValue = item.getAttribute("data-value");
    const statusClass = item.classList[1]; 

    selectedStatusEdit.textContent = item.textContent;
    selectedStatusEdit.className = `selected-option ${statusClass}`;

    statusOptionsEdit.style.display = "none";
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".status-dropdown")) {
    statusOptionsEdit.style.display = "none";
  }
});



// CREATE NEW TASK

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


// EDIT PROJECT

  openModalButton2.addEventListener('click', () => {
    const urlParts = window.location.pathname.split('/');
    const projectID = urlParts[urlParts.indexOf('view_proj') + 1];
    fetch(`/get-project/${projectID}/`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const project = data.project;
            console.log('Project Data:', project);
            
            
            document.getElementById('projectName').value = project.project_name;
            document.getElementById('description2').value = project.project_description;
            document.getElementById('startDate2').value = project.start_date;
            document.getElementById('endDate2').value = project.end_date;
            document.getElementById('selectedStatus2').textContent = project.project_status.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
            document.getElementById('selectedPriority2').textContent = project.project_priority.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
            selectedStatus2.className = `selected-option status-${project.project_status.toLowerCase()}`;
            selectedPriority2.className = `selected-option priority-${project.project_priority.toLowerCase()}`;
        } else {
            console.error('Error fetching project:', data.message);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });
    modalOverlay2.classList.add('show');
  });
  
  closeModalButton2.addEventListener('click', () => {
    modalOverlay2.classList.remove('show');
  });
  
  modalOverlay2.addEventListener('click', (event) => {
    if (event.target === modalOverlay2) {
      modalOverlay2.classList.remove('show');
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
  
//Status

    selectedStatus2.addEventListener("click", () => {
      statusOptions2.style.display =
        statusOptions2.style.display === "block" ? "none" : "block";
    });
  
    statusItems2.forEach((item) => {
      item.addEventListener("click", () => {
        const statusValue = item.getAttribute("data-value");
        const statusClass = item.classList[1]; 
  
        selectedStatus2.textContent = item.textContent;
        selectedStatus2.className = `selected-option ${statusClass}`;
  
        statusOptions2.style.display = "none";
      });
    });
  
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".status-dropdown")) {
        statusOptions2.style.display = "none";
      }
    });
  
//Priority 

    selectedPriority2.addEventListener("click", () => {
      priorityOptions2.style.display =
        priorityOptions2.style.display === "block" ? "none" : "block";
    });
  
    priorityItems2.forEach((item) => {
      item.addEventListener("click", () => {
        const priorityValue = item.getAttribute("data-value");
        const priorityClass = item.classList[1];
  
        selectedPriority2.textContent = item.textContent;
        selectedPriority2.className = `selected-option ${priorityClass}`;
  
        priorityOptions2.style.display = "none";
      });
    });
  
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".priority-dropdown")) {
        priorityOptions2.style.display = "none";
      }
    });
  
// 1
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
  
  
  
  input2.addEventListener("focus", () => {
    memberList2.classList.add("show");
  });
  
  input2.addEventListener("input2", () => {
    const searchValue = input2.value.toLowerCase();
    const members = memberList2.querySelectorAll(".member-item");
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
  if (!input2.contains(event.target) && !memberList2.contains(event.target)) {
      memberList2.classList.remove("show");  
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
  
  
  
  
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".form-group")) {
        memberList2.classList.remove("show");
    }
  });
  
  const memberItems2 = document.querySelectorAll(".member-item");
  memberItems2.forEach(item => {
    item.addEventListener("click", () => {
        input2.value = item.querySelector("span").innerText;
        memberList2.classList.remove("show");
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
  
  });
  
  
  function formatDateToReadable(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date';
  
    const monthAbbrWithPeriod = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
        'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
    ];
  
    const month = monthAbbrWithPeriod[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${month} ${day}, ${year}`;
  }
  
  function editProject() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
    const projectName = document.getElementById('projectName').value;
    const projectDescription = document.getElementById('description2').value;
    const startDate = document.getElementById('startDate2').value;
    const endDate = document.getElementById('endDate2').value;
    const projectStatus = document.getElementById('selectedStatus2').textContent.trim().replace(/\s+/g, '_').toUpperCase();
    const projectPriority = document.getElementById('selectedPriority2').textContent.trim().replace(/\s+/g, '_').toUpperCase();
    const urlParts = window.location.pathname.split('/');
    const projectID = urlParts[urlParts.indexOf('view_proj') + 1];
  
    console.log(projectID, projectName, projectDescription, startDate, endDate, projectStatus, projectPriority);
  
    const data = {
        project_id: projectID,
        project_name: projectName,
        project_description: projectDescription,
        start_date: startDate,
        end_date: endDate,
        project_status: projectStatus,
        project_priority: projectPriority
    };
  
    fetch(`/edit-project/${projectID}/`, {
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
            alert('Project updated successfully!');
            modalOverlay2.classList.remove('show');
            
            document.getElementById('projectTitle').textContent = `${data.project.project_name}`;
            document.getElementById('projectOwner').textContent = `${data.project.user.first_name} ${data.project.user.last_name}`;
            document.getElementById('projectStatus').textContent = data.project.project_status.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()); 
            document.getElementById('projectStartDate').textContent = formatDateToReadable(data.project.start_date);
            document.getElementById('projectEndDate').textContent = formatDateToReadable(data.project.end_date);
            document.getElementById('projectPriority').textContent = data.project.project_priority.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
            document.getElementById('projectDescription').textContent = data.project.project_description;
  
            document.getElementById("projectPriority").className = `priority ${data.project.project_priority.toLowerCase()}`;
            
            const membersContainer = document.getElementById('projectMembers');
            membersContainer.innerHTML = ''; 
            data.project.members.forEach(member => {
                const memberSpan = document.createElement('span');
                memberSpan.classList.add('member');
                memberSpan.textContent = `${member.first_name} ${member.last_name}`;
                membersContainer.appendChild(memberSpan);
            });
  
            const addMemberSpan = document.createElement('span');
            addMemberSpan.id = 'addMembers';
            addMemberSpan.classList.add('member');
            addMemberSpan.textContent = '+';
            membersContainer.appendChild(addMemberSpan);
  
        } else {
            alert('Error updating project: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
  }
  
  
  //Add Members logic
  document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const urlParts = window.location.pathname.split('/');
    const projectID = urlParts[urlParts.indexOf('view_proj') + 1];
  
    const modal = document.getElementById('addMembersModal');
    const openModalBtn = document.getElementById('addMembers');
    const closeModalBtn = document.getElementById('closeAddMembersModal');
    const emailSearch = document.getElementById('emailSearch');
    const emailResults = document.getElementById('emailResults');
    const selectedEmailsContainer = document.getElementById('selectedEmails');
    const addMembersButton = document.getElementById('addMembersButton');
    
    let selectedEmails = new Set();
  
    console.log('Project ID:', projectID);
    console.log('CSRF Token:', csrfToken);
  
    
    openModalBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      console.log('Modal opened for adding members');
    });
  
    
    closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      console.log('Modal closed');
    });
  
    
    function renderSelectedEmails() {
      selectedEmailsContainer.innerHTML = ''; 
    
      selectedEmails.forEach(user => {
        const div = document.createElement('div');
        div.classList.add('user-result', 'selected-email');
        div.innerHTML = `
          <img class="user-image" src="${user.picture || '/static/profile_pictures/default_profile.jpg'}" alt="${user.first_name}">
          <div class="user-info">
            <span class="user-name">${user.first_name} ${user.last_name}</span>
            <span class="user-email">${user.email}</span>
          </div>
          <button class="remove-email" data-email="${user.email}">Remove</button>
        `;
        selectedEmailsContainer.appendChild(div);
      });
    
      document.querySelectorAll('.remove-email').forEach(button => {
        button.addEventListener('click', (e) => {
          const emailToRemove = e.target.getAttribute('data-email');
          selectedEmails.forEach(user => {
            if (user.email === emailToRemove) {
              selectedEmails.delete(user);
            }
          });
          console.log(`Removed user: ${emailToRemove}`);
          renderSelectedEmails();
        });
      });
    }
    
  
    
    emailSearch.addEventListener('input', async () => {
      const query = emailSearch.value.trim();
      console.log('Searching for:', query);
    
      if (query.length < 2) {
        emailResults.innerHTML = '';
        emailResults.style.display = 'none';
        console.log('Search query too short');
        return;
      }
    
      try {
        const response = await fetch(`/api/users/search/?q=${query}&project_id=${projectID}`);
        const data = await response.json();
        console.log('Search results:', data);
    
        emailResults.innerHTML = '';
        emailResults.style.display = 'block';
    
        data.users.forEach(user => {
          if (![...selectedEmails].some(u => u.email === user.email)) {
            const div = document.createElement('div');
            div.classList.add('search-result');
            div.innerHTML = `
              <div class="user-result">
                <img class="user-image" src="${user.picture || '/static/profile_pictures/default_profile.jpg'}" alt="${user.first_name}">
                <div class="user-info">
                  <span class="user-name">${user.first_name} ${user.last_name}</span>
                  <span class="user-email">${user.email}</span>
                </div>
                <button class="select-email" data-email="${user.email}">Select</button>
              </div>
            `;
    
            div.querySelector('.select-email').addEventListener('click', () => {
              selectedEmails.add({
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                picture: user.picture || '/static/profile_pictures/default_profile.jpg'
              });
              console.log(`Selected user: ${user.email}`);
              renderSelectedEmails();
    
              div.remove();
    
              emailSearch.value = '';
              emailResults.innerHTML = '';
              emailResults.style.display = 'none';
            });
    
            emailResults.appendChild(div);
          }
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
        emailResults.style.display = 'none';
      }
    });
    
    
    document.addEventListener('click', (event) => {
      if (!emailSearch.contains(event.target) && !emailResults.contains(event.target)) {
        emailResults.style.display = 'none';
        console.log('Clicked outside. Hiding emailResults.');
      }
    });
    
  
    
    addMembersButton.addEventListener('click', async () => {
      const emails = Array.from(selectedEmails);
      console.log('Attempting to add members:', emails);
  
      try {
        const response = await fetch(`/projects/${projectID}/add-members/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify({ emails: emails })
        });
  
        const data = await response.json();
        console.log('Server response:', data);
  
        if (data.added_users.length) {
          alert(`Successfully added: ${data.added_users.join(', ')}`);
          console.log('Successfully added:', data.added_users);
        }
        if (data.errors.length) {
          alert(`Failed to add: ${data.errors.join(', ')}`);
          console.error('Failed to add:', data.errors);
        }
  
        modal.style.display = 'none';
        selectedEmails.clear();
        renderSelectedEmails();
        console.log('Selected emails cleared and modal closed');
      } catch (error) {
        console.error('Error adding members:', error);
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('modalOverlay');
    const openModalButton = document.getElementById('openModalButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const openAssignMembersModalBtn = document.getElementById('openAssignMembersModalButton');
    const assignMembersModal = document.getElementById('assignMembersModal');
    const closeAssignMembersModal = document.getElementById('closeAssignMembersModal');
    const assignMembersButton = document.getElementById('assignMembersButton');
    const memberSearch = document.getElementById('memberSearch');
    const searchResults = document.getElementById('searchResults');
    const selectedMembersContainer = document.getElementById('selectedMembers');

    let selectedMembers = new Set(); // Temporary storage for selected members

    // Open Create Task Modal
    openModalButton.addEventListener('click', () => {
        modalOverlay.classList.add('show');
    });

    closeModalButton.addEventListener('click', () => {
        modalOverlay.classList.remove('show');
    });

    // Open Assign Members Modal
    openAssignMembersModalBtn.addEventListener('click', () => {
        assignMembersModal.style.display = 'flex';
    });

    closeAssignMembersModal.addEventListener('click', () => {
        assignMembersModal.style.display = 'none';
    });

    // Search and Select Members
    memberSearch.addEventListener('input', async () => {
      const query = memberSearch.value.trim();
      if (query.length < 2) {
          searchResults.innerHTML = '';
          searchResults.style.display = 'none';
          return;
      }
  
      const urlParts = window.location.pathname.split('/');
      const projectID = urlParts[urlParts.indexOf('view_proj') + 1]; // Extract project ID from URL
      const taskID = urlParts.includes('task') ? urlParts[urlParts.indexOf('task') + 1] : null;
  
      if (!projectID) {
          console.error('Project ID is missing!');
          return;
      }
  
      try {
          const response = await fetch(
              `/api/task-users/search/?q=${query}&project_id=${projectID}${taskID ? `&task_id=${taskID}` : ''}`
          );
  
          if (!response.ok) {
              const errorText = await response.text();
              console.error('Search failed:', errorText);
              return;
          }
  
          const data = await response.json();
  
          searchResults.innerHTML = '';
          searchResults.style.display = 'block';
  
          data.users.forEach(user => {
              const div = document.createElement('div');
              div.classList.add('search-result');
              div.innerHTML = `
                  <div class="user-result">
                      <img class="user-image" src="${user.picture || '/static/profile_pictures/default_profile.jpg'}" alt="${user.first_name}">
                      <div class="user-info">
                          <span class="user-name">${user.first_name} ${user.last_name}</span>
                          <span class="user-email">${user.email}</span>
                      </div>
                      <button class="select-member" data-email="${user.email}">Select</button>
                  </div>
              `;
              div.querySelector('.select-member').addEventListener('click', () => {
                  selectedMembers.add({
                      email: user.email,
                      first_name: user.first_name,
                      last_name: user.last_name,
                      picture: user.picture || '/static/profile_pictures/default_profile.jpg'
                  });
                  renderSelectedMembers();
                  div.remove();

                  memberSearch.value = '';
                  searchResults.innerHTML = '';
                  searchResults.style.display = 'none';
              });
              searchResults.appendChild(div);
          });
      } catch (error) {
          console.error('Error fetching search results:', error);
          searchResults.style.display = 'none';
      }
  });
  
  document.addEventListener('click', (event) => {
    if (!memberSearch.contains(event.target) && !searchResults.contains(event.target)) {
      searchResults.style.display = 'none';
      console.log('Clicked outside. Hiding searchResults.');
    }
  });


  function renderSelectedMembers() {
    selectedMembersContainer.innerHTML = '';

    selectedMembers.forEach(user => {
        const div = document.createElement('div');
        div.classList.add('user-result', 'selected-member');
        div.innerHTML = `
            <img class="user-image" src="${user.picture || '/static/profile_pictures/default_profile.jpg'}" alt="${user.first_name}">
            <div class="user-info">
                <span class="user-name">${user.first_name} ${user.last_name}</span>
                <span class="user-email">${user.email}</span>
            </div>
            <button class="remove-member" data-email="${user.email}">Remove</button>
        `;
        div.querySelector('.remove-member').addEventListener('click', () => {
            selectedMembers.forEach(member => {
                if (member.email === user.email) {
                    selectedMembers.delete(member);
                }
            });
            renderSelectedMembers();
        });
        selectedMembersContainer.appendChild(div);
    });

    console.log('Updated selected members:', Array.from(selectedMembers));
}

assignMembersButton.addEventListener('click', () => {
  console.log('Assigned Members Saved:', Array.from(selectedMembers));
  assignMembersModal.style.display = 'none';
});

  // Create Task with Members
  window.addNewTask = async () => {
    const taskName = document.getElementById('taskName').value.trim();
    const taskDescription = document.getElementById('description').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const taskStatus = document.getElementById('selectedStatus').textContent.trim().replace(/\s+/g, '_').toUpperCase();
    const taskPriority = document.getElementById('selectedPriority').textContent.trim().replace(/\s+/g, '_').toUpperCase();
    const projectID = window.location.pathname.split('/').find((part, index, arr) => arr[index - 1] === 'view_proj');

    if (!taskName || !startDate || !endDate) {
        alert('Please fill in all required fields (Task Name, Start Date, End Date).');
        return;
    }

    const assignedMembers = Array.from(selectedMembers).map(member => ({
        email: member.email,
        first_name: member.first_name,
        last_name: member.last_name
    }));

    console.log('Creating task with the following data:', {
        task_name: taskName,
        task_description: taskDescription,
        start_date: startDate,
        end_date: endDate,
        task_status: taskStatus,
        task_priority: taskPriority,
        assigned_members: assignedMembers
    });

    try {
        const response = await fetch(`/create_task/${projectID}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: JSON.stringify({
                task_name: taskName,
                task_description: taskDescription,
                start_date: startDate,
                end_date: endDate,
                task_status: taskStatus,
                task_priority: taskPriority,
                assigned_members: assignedMembers
            }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert('Task created successfully with assigned members!');
            modalOverlay.classList.remove('show');
            selectedMembers.clear();
            renderSelectedMembers();
            await fetchTasks(); // Refresh tasks list
        } else {
            alert(`Error creating task: ${data.message}`);
        }
      } catch (error) {
          console.error('Error creating task:', error);
          alert('Failed to create task. Please try again.');
      }
  };
  
});

  document.addEventListener('DOMContentLoaded', async () => {
    const taskListContainer = document.getElementById('taskAssignments');
    console.log("Task List Container:", taskListContainer);
  
    const urlParts = window.location.pathname.split('/');
    const projectID = urlParts[urlParts.indexOf('view_proj') + 1];
    console.log("Extracted Project ID:", projectID);
  
    // Fetch Tasks from Backend
    async function fetchTasks() {
        window.fetchTasks = fetchTasks;
  
        console.log("🔵 Fetching tasks from API...");
        try {
            const response = await fetch(`/api/projects/${projectID}/tasks/`);
            console.log("API Response:", response);
  
            const data = await response.json();
            console.log("Parsed JSON Response:", data);
  
            if (data.tasks && data.tasks.length > 0) {
                console.log(`${data.tasks.length} tasks found. Rendering tasks...`);
                renderTasks(data.tasks);
            } else {
                console.warn("No tasks found. Displaying empty state.");
                taskListContainer.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center;">No tasks found.</td>
                    </tr>`;
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            taskListContainer.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center;">No tasks found.</td>
                </tr>`;
        }
    }
  
    function renderTasks(tasks) {
      console.log("Rendering tasks into the table...");
      taskListContainer.innerHTML = '';
  
      tasks.forEach((task, index) => {
          console.log(`Task #${index + 1}:`, task);
  
          // Ensure task.id exists
          const taskId = task.id || task.task?.id;
          if (!taskId) {
              console.warn('Task ID is undefined for task:', task);
              return;
          }
  
          const assignedMembers = task.assigned_members.length > 0 
              ? task.assigned_members.join(', ') 
              : 'No members assigned';
  
          const row = document.createElement('tr');
          row.classList.add('task-row');
          row.setAttribute('data-task-id', taskId); // Use the correct task ID
  
          row.innerHTML = `
              <td>${task.task_name || task.task?.task_name}</td>
              <td>${assignedMembers}</td>
              <td>
                  <span class="status-badge status-${(task.task_status || task.task?.task_status).replace(' ', '_').toLowerCase()}">
                      ${(task.task_status_display || task.task?.task_status_display).replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
              </td>
              <td>${task.start_date || task.task?.start_date}</td>
              <td>${task.end_date || task.task?.end_date}</td>
              <td>
                  <span class="priority-${(task.task_priority || task.task?.task_priority).toLowerCase()}">
                      ${task.task_priority_display || task.task?.task_priority_display}
                  </span>
              </td>
              <td>
                  <div class="progress" style="height: 8px;">
                      <div class="progress-bar" style="width: ${(task.progress || task.task?.progress)}%;"></div>
                  </div>
              </td>
          `;
  
          // Attach click event to open manage modal
          row.addEventListener('click', async () => {
              console.log(`Fetching task details for Task ID: ${taskId}`);
              currentTaskId = taskId; // Explicitly set the current task ID before opening the modal
              await openEditTaskModal(taskId);
          });
  
          console.log(`Appending row for task: ${task.task_name || task.task?.task_name}`);
          taskListContainer.appendChild(row);
      });
  
      console.log('All tasks rendered successfully!');
  }
  
  
    console.log("Initializing fetchTasks...");
    await fetchTasks();
    console.log("fetchTasks completed!");

  });
  

//Edit Task

closeModalButtonEdit.addEventListener('click', () => {
  modalOverlayEdit.classList.remove('show');
});

document.addEventListener('DOMContentLoaded', () => {
  const closeModalButtonEdit = document.getElementById('closeModalButtonEdit');
  const saveTaskButton = document.getElementById('saveTaskButton'); 
  const modalOverlayEdit = document.getElementById('modalOverlayEdit');

  let currentTaskId = null; 

  // Close modal
  closeModalButtonEdit.addEventListener('click', () => {
      modalOverlayEdit.classList.remove('show');
  });

  // Save updated task
  saveTaskButton.addEventListener('click', async () => {
      if (!currentTaskId) {
          console.error('No task selected for updating.');
          alert('No task selected. Please try again.');
          return;
      }

      const taskName = document.getElementById('taskNameEdit').value.trim();
      const taskDescription = document.getElementById('descriptionEdit').value.trim();
      const startDate = document.getElementById('startDateEdit').value;
      const endDate = document.getElementById('endDateEdit').value;
      const taskStatus = document.getElementById('selectedStatusEdit').textContent.trim().replace(/\s+/g, '_').toUpperCase();
      const taskPriority = document.getElementById('selectedPriorityEdit').textContent.trim().replace(/\s+/g, '_').toUpperCase();
      
      // Explicitly fetch and parse task progress
      const taskProgressElement = document.getElementById('taskPercentageEdit');
      let taskProgress = taskProgressElement ? taskProgressElement.value.trim() : '0';

      // Ensure it's a valid number
      taskProgress = taskProgress !== '' ? parseInt(taskProgress, 10) : 0;

      if (isNaN(taskProgress) || taskProgress < 0 || taskProgress > 100) {
          alert('Task Progress must be a number between 0 and 100.');
          return;
      }

      console.log('Updating Task with ID:', currentTaskId);
      console.log({
          task_name: taskName,
          task_description: taskDescription,
          start_date: startDate,
          end_date: endDate,
          task_status: taskStatus,
          task_priority: taskPriority,
          task_progress: taskProgress,
      });

      try {
          const response = await fetch(`/api/tasks/${currentTaskId}/update/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
              },
              body: JSON.stringify({
                  task_name: taskName,
                  task_description: taskDescription,
                  start_date: startDate,
                  end_date: endDate,
                  task_status: taskStatus,
                  task_priority: taskPriority,
                  task_progress: taskProgress, // Pass the correct value
              }),
          });

          const data = await response.json();

          if (response.ok && data.status === 'success') {
              console.log('Task updated successfully:', data);
              alert('Task updated successfully!');
              modalOverlayEdit.classList.remove('show');
              await fetchTasks(); // Refresh the tasks list
          } else {
              console.error('Failed to update task:', data.message);
              alert('You are not assigned to this task.');
          }
      } catch (error) {
          console.error('Error updating task:', error);
          alert('An error occurred while updating the task.');
      }
  });

  // Open Edit Modal
  async function openEditTaskModal(taskId) {
      console.log(`Fetching task details for Task ID: ${taskId}`);
      currentTaskId = taskId; 

      try {
          const response = await fetch(`/api/tasks/${taskId}/`);
          const data = await response.json();

          if (response.ok && data.status === 'success') {
              console.log('Task Data:', data);

              document.getElementById('taskNameEdit').value = data.task.task_name;
              document.getElementById('descriptionEdit').value = data.task.task_description;
              document.getElementById('startDateEdit').value = data.task.start_date;
              document.getElementById('endDateEdit').value = data.task.end_date;
              document.getElementById('selectedStatusEdit').textContent = data.task.task_status.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
              document.getElementById('selectedPriorityEdit').textContent = data.task.task_priority.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

              // Ensure task progress field is populated
              if (document.getElementById('taskPercentageEdit')) {
                  document.getElementById('taskPercentageEdit').value = data.task.task_progress || 0;
              }

              modalOverlayEdit.classList.add('show');
          } else {
              console.error('Failed to fetch task details:', data.message);
              alert('Failed to load task details. Please try again.');
          }
      } catch (error) {
          console.error('Error fetching task details:', error);
          alert('An error occurred while loading task details.');
      }
  }

  window.openEditTaskModal = openEditTaskModal;
});

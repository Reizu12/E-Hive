document.addEventListener('DOMContentLoaded', () => {
    const ganttContainer = document.getElementById('gantt');
    const projectDropdownButton = document.getElementById('projectDropdown');
    const exportAsExcelButton = document.getElementById('exportAsExcel');
    let ganttChart = null;
    let currentTasks = [];

    
    async function fetchProjectTasks(projectId) {
        try {
            const response = await fetch(`/api/projects-gantt/${projectId}/tasks/`);
            const data = await response.json();

            if (data.error) {
                ganttContainer.innerHTML = '<p>Error loading tasks. Please try again.</p>';
                return;
            }

            currentTasks = data.tasks;
            renderGanttChart(data.tasks);
        } catch (error) {
            ganttContainer.innerHTML = '<p>Failed to load tasks. Please check your connection.</p>';
        }
    }

    
    function renderGanttChart(tasks) {
        ganttContainer.innerHTML = '';

        if (tasks.length === 0) {
            ganttContainer.innerHTML = '<p>No tasks available for this project.</p>';
            return;
        }

        const ganttTasks = tasks.map(task => ({
            id: task.id,
            name: task.name,
            start: task.start,
            end: task.end,
            progress: task.progress,
            status: task.status || 'Unknown',
            priority: task.priority || 'Unknown',
            assigned_members: task.assigned_members || [],
            custom_class: `status_${(task.status || '').toLowerCase()}`,
        }));

        if (ganttChart) {
            ganttChart.refresh(ganttTasks);
        } else {
            ganttChart = new Gantt("#gantt", ganttTasks, {
                view_mode: 'Day',
                date_format: 'YYYY-MM-DD',
                custom_popup_html: function (task) {
                    const assignedTo = task.assigned_members.length > 0 
                        ? task.assigned_members.join(', ') 
                        : 'No one assigned';
    
                    return `
                        <div class="card p-3" style="width: 210px;">
                            <h3><b>${task.name}</b></h3>
                            <p><b>Status:</b> ${(task.status || 'N/A').replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}</p>
                            <p><b>Priority:</b> ${task.priority || 'N/A'}</p>
                            <p><b>Start:</b> ${task.start}</p>
                            <p><b>End:</b> ${task.end}</p>
                            <p><b>Progress:</b> ${task.progress}%</p>
                            <p><b>Assigned To:</b> ${assignedTo}</p>
                        </div>
                    `;
                }
            });
        }
    }

    
    exportAsExcelButton.addEventListener('click', () => {
        if (!currentTasks || currentTasks.length === 0) {
            alert('No tasks available to export.');
            return;
        }

        const workbook = XLSX.utils.book_new();
        const worksheetData = [];
        const timeline = [];
        const startDate = new Date(Math.min(...currentTasks.map(t => new Date(t.start).getTime())));
        const endDate = new Date(Math.max(...currentTasks.map(t => new Date(t.end).getTime())));

        
        const currentDate = new Date(startDate);
        timeline.push('Task Name', 'Assigned Members', 'Progress');

        while (currentDate <= endDate) {
            timeline.push(currentDate.toISOString().split('T')[0]); 
            currentDate.setDate(currentDate.getDate() + 1);
        }

        worksheetData.push(timeline);

        
        currentTasks.forEach(task => {
            const row = Array(timeline.length).fill('');

            row[0] = task.name;
            row[1] = task.assigned_members?.join(', ') || 'N/A';
            row[2] = `${task.progress}%`;

            const taskStart = new Date(task.start);
            const taskEnd = new Date(task.end);

            for (let i = 3; i < timeline.length; i++) {
                const columnDate = new Date(timeline[i]);
                if (columnDate >= taskStart && columnDate <= taskEnd) {
                    row[i] = '███'; 
                }
            }

            worksheetData.push(row);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = 1; R <= range.e.r; ++R) {
            for (let C = 3; C <= range.e.c; ++C) {
                const cellAddress = { c: C, r: R };
                const cellRef = XLSX.utils.encode_cell(cellAddress);
                if (worksheet[cellRef] && worksheet[cellRef].v === '███') {
                    worksheet[cellRef].s = {
                        fill: {
                            fgColor: { rgb: "FFC000" }, 
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center",
                        },
                    };
                }
            }
        }

        worksheet['!cols'] = [
            { wch: 30 }, 
            { wch: 25 }, 
            { wch: 15 }, 
            ...Array(timeline.length - 3).fill({ wch: 4 })
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Gantt Chart');
        XLSX.writeFile(workbook, `gantt_chart_${savedProjectName || 'project'}.xlsx`);
    });

    const savedProjectId = localStorage.getItem('lastSelectedProjectId');
    const savedProjectName = localStorage.getItem('lastSelectedProjectName');

    if (savedProjectId && savedProjectName) {
        projectDropdownButton.textContent = savedProjectName; 
        fetchProjectTasks(savedProjectId);
    } else {
        ganttContainer.innerHTML = '<p>Select a project to view tasks.</p>';
    }

    document.querySelectorAll('.project-option').forEach(option => {
        option.addEventListener('click', (event) => {
            const projectId = event.target.dataset.projectId;
            const projectName = event.target.textContent.trim(); 

            projectDropdownButton.textContent = projectName;

            localStorage.setItem('lastSelectedProjectId', projectId);
            localStorage.setItem('lastSelectedProjectName', projectName);

            fetchProjectTasks(projectId);
        });
    });
});

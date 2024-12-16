document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("student-form");
    const profileTableBody = document.getElementById("profile-table-body");
    const tableContainer = document.getElementById("table-container");
    const noStudentsMessage = document.getElementById("no-students-message");
    let isEditing = false;
    let editStudentId = null;

    function loadStudentDetails() {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        if (students.length === 0) {
            tableContainer.classList.add("hidden");
            noStudentsMessage.classList.remove("hidden");
        } else {
            tableContainer.classList.remove("hidden");
            noStudentsMessage.classList.add("hidden");
            students.forEach(student => {
                appendStudentToTable(student);
            });
        }
        toggleTableBodyHeight(students.length);
    }

    function appendStudentToTable(student) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${student.name}</td>
            <td class="py-2 px-4 border-b">${student.id}</td>
            <td class="py-2 px-4 border-b">${student.email}</td>
            <td class="py-2 px-4 border-b">${student.phone}</td>
            <td class="py-2 px-4 border-b text-center">
                <button class="edit-button" aria-label="Edit Student">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="trash-button" aria-label="Delete Student">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        profileTableBody.appendChild(row);
        row.setAttribute('data-id', student.id);
    }

    function toggleTableBodyHeight(count) {
        const maxRecords = 5;
        if (count > maxRecords) {
            profileTableBody.parentElement.classList.add("max-h-64", "overflow-y-auto");
        } else {
            profileTableBody.parentElement.classList.remove("max-h-64", "overflow-y-auto");
        }
    }

    loadStudentDetails();

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const id = document.getElementById("id").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        const student = { name, id, email, phone };

        let students = JSON.parse(localStorage.getItem('students')) || [];

        // Check for duplicates
        const duplicate = students.some(s => s.id === id || s.email === email || s.phone === phone);
        if (duplicate && !isEditing) {
            alert('Student details already exist');
            return;
        }

        if (isEditing) {
            // Update the existing student information
            students = students.map(s => s.id === editStudentId ? student : s);
            isEditing = false;
            editStudentId = null;
        } else {
            // Add new student
            students.push(student);
        }

        localStorage.setItem('students', JSON.stringify(students));
        profileTableBody.innerHTML = ''; // Clear existing table content
        loadStudentDetails(); // Reload student details

        tableContainer.classList.remove("hidden");
        noStudentsMessage.classList.add("hidden");
        form.reset();
        profileTableBody.lastChild.scrollIntoView({ behavior: 'smooth' });
    });

    profileTableBody.addEventListener("click", function(e) {
        if (e.target.closest(".trash-button")) {
            const row = e.target.closest("tr");
            const studentId = row.getAttribute('data-id');
            removeStudentFromLocalStorage(studentId);
            row.remove();

            const students = JSON.parse(localStorage.getItem('students')) || [];
            if (students.length === 0) {
                tableContainer.classList.add("hidden");
                noStudentsMessage.classList.remove("hidden");
            }
            toggleTableBodyHeight(students.length);
        }

        if (e.target.closest(".edit-button")) {
            const row = e.target.closest("tr");
            const studentId = row.getAttribute('data-id');
            const student = JSON.parse(localStorage.getItem('students')).find(s => s.id === studentId);

            // Populate form with student details
            document.getElementById("name").value = student.name;
            document.getElementById("id").value = student.id;
            document.getElementById("email").value = student.email;
            document.getElementById("phone").value = student.phone;

            isEditing = true;
            editStudentId = studentId;

            // Scroll form into view
            form.scrollIntoView({ behavior: 'smooth' });
        }
    });

    function removeStudentFromLocalStorage(studentId) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const updatedStudents = students.filter(student => student.id !== studentId);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
    }
});

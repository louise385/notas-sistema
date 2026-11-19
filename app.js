const API_STUDENTS = '/students';
const API_GRADES = '/grades';

// ---------------------------
// CARGA INICIAL
// ---------------------------

document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    loadGrades();
});

// ---------------------------
// ELEMENTOS HTML
// ---------------------------

const studentForm = document.getElementById('studentForm');
const gradeForm = document.getElementById('gradeForm');
const filterStudent =
    document.getElementById('filterStudent');

filterStudent.addEventListener(
    'change',
    () => {
        loadGrades();
    }
);

// ---------------------------
// REGISTRAR ESTUDIANTE
// ---------------------------

studentForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();

    try {

        const response = await fetch(API_STUDENTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email
            })
        });

        const data = await response.json();

        alert(data.message || 'Estudiante registrado');

        studentForm.reset();

        loadStudents();

    } catch (error) {
        console.error(error);
        alert('Error al registrar estudiante');
    }

});

// ---------------------------
// REGISTRAR NOTA
// ---------------------------

gradeForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const student_id = document.getElementById('studentSelect').value;
    const subject = document.getElementById('subject').value.trim();
    const grade = parseFloat(
        document.getElementById('grade').value
    );

    try {

        const response = await fetch(API_GRADES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                student_id,
                subject,
                grade
            })
        });

        const data = await response.json();

        alert(data.message || 'Nota registrada');

        gradeForm.reset();

        loadGrades();

    } catch (error) {

        console.error(error);

        alert('Error al registrar nota');
    }

});

// ---------------------------
// CARGAR ESTUDIANTES
// ---------------------------

async function loadStudents() {

    try {

        const response = await fetch(API_STUDENTS);
        const students = await response.json();

        const table =
            document.getElementById('studentsTable');


        const select =
            document.getElementById('studentSelect');
const filter =
    document.getElementById('filterStudent');


        table.innerHTML = '';
        select.innerHTML =
            '<option value="">Seleccione un estudiante</option>';
filter.innerHTML =
    '<option value="">Todos los estudiantes</option>';

        students.forEach(student => {

            table.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
<td>
<button
    class="edit-btn"
    onclick="editStudent(${student.id}, '${student.name}', '${student.email}')">
    Editar
</button>

<button
    class="delete-btn"
    onclick="deleteStudent(${student.id})">
    Eliminar
</button>

</td>
                </tr>
            `;

            select.innerHTML += `
                <option value="${student.id}">
                    ${student.name}
                </option>
            `;
filter.innerHTML += `
    <option value="${student.id}">
        ${student.name}
    </option>
`;

        });

    } catch (error) {

        console.error(error);

        alert('Error al cargar estudiantes');
    }
}

// ---------------------------
// CARGAR NOTAS
// ---------------------------

async function loadGrades() {

    try {

        const response = await fetch(API_GRADES);

        const grades = await response.json();

        const table =
            document.getElementById('gradesTable');

const averageDisplay =
    document.getElementById('averageDisplay');


        table.innerHTML = '';

const selectedStudent =
    filterStudent.value;

const filteredGrades = grades.filter(grade => {

    if (!selectedStudent)
        return true;

    return (
        grade.student_id ==
        selectedStudent
    );

});
let average = 0;

if (filteredGrades.length > 0) {

    const total = filteredGrades.reduce(
        (sum, grade) =>
            sum + Number(grade.grade),
        0
    );

    average =
        total / filteredGrades.length;
}

if (selectedStudent) {

    const selectedOption =
        filterStudent.options[
            filterStudent.selectedIndex
        ].text;

    averageDisplay.textContent =
        `Promedio de ${selectedOption}: ${average.toFixed(2)}`;

} else {

    averageDisplay.textContent =
        `Promedio General: ${average.toFixed(2)}`;
}

filteredGrades.forEach(grade => {
            table.innerHTML += `
                <tr>
                    <td>${grade.id}</td>
                    <td>${grade.student_name}</td>
                    <td>${grade.subject}</td>
                    <td>${grade.grade}</td>
<td>
<button
    class="edit-btn"
    onclick="editGrade(

            ${grade.id},
            '${grade.subject}',
            ${grade.grade}
        )">
        Editar
    </button>

<button
    class="delete-btn"
    onclick="deleteGrade(${grade.id})">
        Eliminar
    </button>
</td>                
</tr>
            `;

        });

    } catch (error) {

        console.error(error);

        alert('Error al cargar notas');
    }
}

// ---------------------------
// ELIMINAR ESTUDIANTE
// ---------------------------

async function deleteStudent(id) {

    const confirmDelete =
        confirm('¿Eliminar estudiante?');

    if (!confirmDelete) return;

    try {

        await fetch(
            `${API_STUDENTS}/${id}`,
            {
                method: 'DELETE'
            }
        );

        loadStudents();
        loadGrades();

    } catch (error) {

        console.error(error);

        alert('Error al eliminar');
    }
}

// ---------------------------
// ELIMINAR NOTA
// ---------------------------

async function deleteGrade(id) {

    const confirmDelete =
        confirm('¿Eliminar nota?');

    if (!confirmDelete) return;

    try {

        await fetch(
            `${API_GRADES}/${id}`,
            {
                method: 'DELETE'
            }
        );

        loadGrades();

    } catch (error) {

        console.error(error);

        alert('Error al eliminar');
    }
 }
async function editStudent(id, currentName, currentEmail) {

    const newName = prompt(
        'Nuevo nombre:',
        currentName
    );

    if (!newName) return;

    const newEmail = prompt(
        'Nuevo correo:',
        currentEmail
    );

    if (!newEmail) return;

    try {

        const response = await fetch(
            `${API_STUDENTS}/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    email: newEmail
                })
            }
        );

        const data = await response.json();

alert(data.message);

loadStudents();
loadGrades();

    } catch (error) {

        console.error(error);

        alert('Error al actualizar estudiante');
    }
}

async function editGrade(id, currentSubject, currentGrade) {

    const newSubject = prompt(
        'Nueva materia:',
        currentSubject
    );

    if (!newSubject) return;

    const newGrade = parseFloat(
        prompt(
            'Nueva nota:',
            currentGrade
        )
    );

    if (isNaN(newGrade)) return;

    if (newGrade < 0 || newGrade > 5) {
        alert('La nota debe estar entre 0 y 5');
        return;
    }

    try {

        const response = await fetch(
            `${API_GRADES}/${id}`
        );

        const currentData =
            await response.json();

        await fetch(
            `${API_GRADES}/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    student_id: currentData.student_id,
                    subject: newSubject,
                    grade: newGrade
                })
            }
        );

        alert('Nota actualizada correctamente');

        loadGrades();

    } catch (error) {

        console.error(error);

        alert('Error al actualizar nota');
    }
}
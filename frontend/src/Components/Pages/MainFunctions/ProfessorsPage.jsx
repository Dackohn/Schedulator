import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import "./MainFunctions.css";
import DeleteIcon from '@mui/icons-material/Delete';

function AddProfessorModal({ isOpen, onClose, onSubmit, professor, setProfessor }) {
  if (!isOpen) return null;

  const handleCourseChange = (e) => {
    const parts = e.target.value.split(',').map(part => part.trim());
    const courses = [{
        name: parts[0] || '', 
        course_type: parts[1] || ''
    }];
    setProfessor({ ...professor, courses });
};


  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add New Professor</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(professor);
          onClose(); // Close modal on submit
        }}>
          <input 
            type="text"
            placeholder="Name"
            value={professor.name}
            onChange={e => setProfessor({ ...professor, name: e.target.value })}
            required
          />
          <input 
            type="text"
            placeholder="Courses (name,type)"
            onChange={handleCourseChange}
            required
          />
          <input 
            type="text"
            placeholder="Language"
            value={professor.language}
            onChange={e => setProfessor({ ...professor, language: e.target.value })}
            required
          />
          <button type="submit">Add Professor</button>
          <button onClick={onClose} type="button">Cancel</button>
        </form>
      </div>
    </div>
  );
}



function ProfessorsPage() {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfessor, setNewProfessor] = useState({ name: '', courses: [], language: '' });

  useEffect(() => {
    fetch('http://localhost:5000/professors', {method: 'GET', credentials: 'include'})
      .then(response => response.json())
      .then(data => {
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers);
        } else {
          setTeachers([]);
        }
      })
      .catch(error => {
        console.error('Error fetching teacher data:', error);
        setTeachers([]);
      });
}, []);


const handleAddProfessor = (professor) => {
  fetch('http://localhost:5000/add-professor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ data: professor }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
    if (data.message === 'Professor added successfully') {
      setTeachers(prevTeachers => [...prevTeachers, {...professor, id: data.newId}]); // Assuming your backend returns a newId
      setNewProfessor({ name: '', courses: [], language: '' }); 
    }
  })
  .catch(error => console.error('Error adding professor:', error));
};


  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='app_container'>
      <Sidebar />
      <div className='content_wrapper'>
    <div className='search-container'>
      <input
        type="text"
        placeholder="Search by professor name..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className='search-box'
      />
      <div className='add-container'>
      <button onClick={() => setIsModalOpen(true)} className="add-button">+</button>
      <AddProfessorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProfessor}
        professor={newProfessor}
        setProfessor={setNewProfessor}
      />
      </div>
    </div>
    <div className='display_box'>
        <table className='list_table'>
          <thead>
            <tr>
              <th className='table-column'>ID</th>
              <th className='table-column'>Professor</th>
              <th className='table-column'>Courses</th>
              <th className='table-column'>Language</th>
              <th className='table-column'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td className='table-column'>{index + 1}</td>
                <td className='table-column'>{teacher.name}</td>
                <td className='courses table-column'>{teacher.courses.map(course => (
                  <span key={course}>{course[0]}, {course[1]} </span>
                ))}</td>
                <td className='table-column'>{teacher.language}</td>
                <td className='delete-icon table-column'><DeleteIcon /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default ProfessorsPage;
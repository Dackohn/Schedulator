import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import "./MainFunctions.css";

function AddCourseModal({ isOpen, onClose, onSubmit, course, setCourse }) {
  if (!isOpen) return null;

  const handleCourseChange = (e) => {
    const parts = e.target.value.split(',').map(part => part.trim());
    const courses = [{
      name: parts[0] || '',
      course_type: parts[1] || ''
    }];
    setCourse({ ...course, courses });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add New Course</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(course);
          onClose();
        }}>
          <input
            type="text"
            placeholder="Course Name"
            value={course.name}
            onChange={e => setCourse({ ...course, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Course Type"
            onChange={handleCourseChange}
            required
          />
          <button type="submit">Add Course</button>
          <button onClick={onClose} type="button">Cancel</button>
        </form>
      </div>
    </div>
  );
}

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', course_type: '' });

  useEffect(() => {
    fetch('http://localhost:5000/courses', { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
      })
      .catch(error => {
        console.error('Error fetching course data:', error);
        setCourses([]);
      });
  }, []);

  const handleAddCourse = (course) => {
    fetch('http://localhost:5000/add-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ data: course }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        if (data.message === 'Course added successfully') {
          setCourses(prevCourses => [...prevCourses, { ...course, id: data.newId }]);
          setNewCourse({ name: '', course_type: '' });
        }
      })
      .catch(error => console.error('Error adding course:', error));
  };

  const filteredCourses = courses.filter(course =>
    course.name && String(course.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='app_container'>
      <Sidebar />
      <div className='content_wrapper'>
        <div className='search-container'>
          <input
            type="text"
            placeholder="Search by course name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='search-box'
          />
          <div className='add-container'>
            <button onClick={() => setIsModalOpen(true)} className="add-button">+</button>
            <AddCourseModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddCourse}
              course={newCourse}
              setCourse={setNewCourse}
            />
          </div>
        </div>
        <div className='display_box'>
          <table className='list_table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Course Name</th>
                <th>Course Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={course.id || index}>
                  <td>{index + 1}</td>
                  <td>{course.name}</td>
                  <td className='courses'>{course.course_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;

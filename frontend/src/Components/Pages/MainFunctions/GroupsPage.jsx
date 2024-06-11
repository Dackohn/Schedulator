import React, {useState, useEffect} from 'react'
import Sidebar from '../Sidebar'
import "./MainFunctions.css";
import DeleteIcon from '@mui/icons-material/Delete';


function CourseModal({ isOpen, onClose, courses }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h2>Courses</h2>
          <ul>
            {courses.map((course, index) => (
              <li key={index}>{course[0]}, {course[1]}, {course[2]}</li>
            ))}
          </ul>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }


function AddGroupModal({ isOpen, onClose, onSubmit, group, setGroup }) {
  if (!isOpen) return null;

  const handleGroupNameChange = (e) => {
      setGroup({ ...group, name: e.target.value });
  };

  const handleLanguageChange = (e) => {
      setGroup({ ...group, language: e.target.value });
  };

  const handleCourseChange = (index, field) => (e) => {
      const updatedCourses = group.courses.map((course, i) => {
          if (i === index) {
              return { ...course, [field]: field === 'count' ? parseInt(e.target.value) : e.target.value };
          }
          return course;
      });
      setGroup({ ...group, courses: updatedCourses });
  };

  const addCourse = () => {
      setGroup({
          ...group,
          courses: [...group.courses, { name: '', type: '', count: 0 }]
      });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      // Submit data in the format ["name", "type", count]
      const formattedCourses = group.courses.map(course => [course.name, course.type, course.count]);
      onSubmit({ ...group, courses: formattedCourses });
      onClose();
  };

  return (
      <div className="modal-backdrop">
          <div className="modal">
              <h2>Add New Group</h2>
              <form onSubmit={handleSubmit}>
                  <input
                      type="text"
                      placeholder="Group Name"
                      value={group.name}
                      onChange={handleGroupNameChange}
                      required
                  />
                  <input
                      type="text"
                      placeholder="Language"
                      value={group.language}
                      onChange={handleLanguageChange}
                      required
                  />
                  {group.courses.map((course, index) => (
                      <div key={index}>
                          <input
                              type="text"
                              placeholder="Course Name"
                              value={course.name}
                              onChange={handleCourseChange(index, 'name')}
                              required
                          />
                          <input
                              type="text"
                              placeholder="Course Type"
                              value={course.type}
                              onChange={handleCourseChange(index, 'type')}
                              required
                          />
                          <input
                              type="number"
                              placeholder="Number of courses per week"
                              value={course.count}
                              onChange={handleCourseChange(index, 'count')}
                              required
                          />
                      </div>
                  ))}
                  <button type="button" onClick={addCourse}>Add Course</button>
                  <button type="submit">Add Group</button>
                  <button onClick={onClose} type="button">Cancel</button>
              </form>
          </div>
      </div>
  );
}

function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', language: '', courses: [] });
  
    useEffect(() => {
      fetch('http://localhost:5000/groups', { method: 'GET', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          if (data.groups && data.groups.length > 0) {
            setGroups(data.groups);
          } else {
            setGroups([]);
          }
        })
        .catch(error => {
          console.error('Error fetching groups:', error);
          setGroups([]); // Ensure groups is set to an empty array on error
        });
    }, []);
  
    const handleAddGroup = (group) => {
      fetch('http://localhost:5000/add-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ data: group })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          if (data.message === 'Group added successfully') {
            setGroups([...groups, { ...group, id: data.newId }]); // Assume backend sends newId
            setNewGroup({ name: '', language: '', courses: [] }); // Reset form
          }
        })
        .catch(error => console.error('Error adding group:', error));
    };
  
    const filteredGroups = groups.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const openCourseModal = (courses) => {
      setSelectedCourses(courses);
      setIsCourseModalOpen(true);
    };
  
    return (
      <div className='app_container'>
        <Sidebar />
        <div className='content_wrapper'>
          <div className='search-container'>
            <input
              type="text"
              placeholder="Search by group name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='search-box'
            />
            <button onClick={() => setIsModalOpen(true)} className="add-button">Add Group</button>
          </div>
          <div className='display_box'>
            <table className='list_table'>
              <thead>
                <tr>
                  <th className='table-column'>ID</th>
                  <th className='table-column'>Group Name</th>
                  <th className='table-column'>Courses</th>
                  <th className='table-column'>Language</th>
                  <th className='table-column' >Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group, index) => (
                  <tr key={group.id || index}>
                    <td className='table-column'>{index + 1}</td>
                    <td className='table-column'>{group.name}</td>
                    <td className='table-column'>
                      <button onClick={() => openCourseModal(group.courses)}>View Courses</button>
                    </td>
                    <td className='table-column'>{group.language}</td>
                    <td className='delete-icon table-column'><DeleteIcon /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AddGroupModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddGroup}
            group={newGroup}
            setGroup={setNewGroup}
          />
          <CourseModal
            isOpen={isCourseModalOpen}
            onClose={() => setIsCourseModalOpen(false)}
            courses={selectedCourses}
          />
        </div>
      </div>
    );
  }
  
  export default GroupsPage;
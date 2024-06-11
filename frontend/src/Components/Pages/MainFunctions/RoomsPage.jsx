import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import "./MainFunctions.css";

function AddRoomModal({ isOpen, onClose, onSubmit, room, setRoom }) {
  if (!isOpen) return null;

  const handleOfficeChange = (e) => {
    const parts = e.target.value.split(',').map(part => part.trim());
    const offices = [{
      name: parts[0] || '',
      office_type: parts[1] || ''
    }];
    setRoom({ ...room, offices });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add New Room</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(room);
          onClose();
        }}>
          <input
            type="text"
            placeholder="Room Name"
            value={room.name}
            onChange={e => setRoom({ ...room, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Office Type"
            onChange={handleOfficeChange}
            required
          />
          <button type="submit">Add Room</button>
          <button onClick={onClose} type="button">Cancel</button>
        </form>
      </div>
    </div>
  );
}

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', offices: [] });

  useEffect(() => {
    fetch('http://localhost:5000/rooms', { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.offices && data.offices.length > 0) {
          setRooms(data.offices);
        } else {
          setRooms([]);
        }
      })
      .catch(error => {
        console.error('Error fetching room data:', error);
        setRooms([]);
      });
  }, []);

  const handleAddRoom = (room) => {
    fetch('http://localhost:5000/add-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ data: room }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        if (data.message === 'Room added successfully') {
          setRooms(prevRooms => [...prevRooms, { ...room, id: data.newId }]);
          setNewRoom({ name: '', offices: [] });
        }
      })
      .catch(error => console.error('Error adding room:', error));
  };

  const filteredRooms = rooms.filter(room =>
    room.name && String(room.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='app_container'>
      <Sidebar />
      <div className='content_wrapper'>
        <div className='search-container'>
          <input
            type="text"
            placeholder="Search by room name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='search-box'
          />
          <div className='add-container'>
            <button onClick={() => setIsModalOpen(true)} className="add-button">+</button>
            <AddRoomModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddRoom}
              room={newRoom}
              setRoom={setNewRoom}
            />
          </div>
        </div>
        <div className='display_box'>
          <table className='list_table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Room Name</th>
                <th>Office Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room, index) => (
                <tr key={room.id || index}>
                  <td>{index + 1}</td>
                  <td>{room.name}</td>
                  <td className='courses'>{room.office_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;

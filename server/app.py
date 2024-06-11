from flask import Flask, request, abort, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from config import ApplicationConfig
from models import db, User
import json
from create_schedule import create_schedule_dataframe, save_schedule_as_image
from create_vertex import create_graph_and_apply_coloring
from functions import load_data_from_json, Teach, Grup, Office
from classes import Teacher, Group, Offices
from add_del import add_data_to_json, data_exists_in_json, remove_data_from_json

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
server_session = Session(app)
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route('/professors')
def get_teach_data():
    user_id = session.get('user_id', None)
    user = User.query.get(user_id)
    if not user or not user.ScheduleData:
        return jsonify({"error": "No schedule data found"}), 404

    try:
        if user.ScheduleData:
            schedule_data = json.loads(user.ScheduleData)
            _, teachers = Teach(schedule_data)
            return jsonify({'count': len(teachers), 'teachers': teachers})
        else:
            return jsonify({'count': 0, 'teachers': []})
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode JSON"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-professor', methods=['POST'])
def add_professor():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    try:
        data = request.json.get('data')
        new_teacher = Teacher(name=data['name'], courses=data['courses'], language=data['language'])

        add_data_to_json(user_id, 'Teacher', new_teacher)
        return jsonify({'message': 'Professor added successfully'}), 200
    except KeyError as e:
        return jsonify({'error': f'Missing key {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/remove-professor', methods=['POST'])
def remove_professor():
    user_id = request.json.get('userId')
    name = request.json.get('name')

    remove_data_from_json(user_id, name)
    return jsonify({'message': 'Professor removed successfully'}), 200

@app.route('/groups')
def get_group_data():
    user_id = get_current_user_id()
    user = User.query.get(user_id)
    if not user or not user.ScheduleData:
        return jsonify({"error": "No schedule data found"}), 404

    try:
        if user.ScheduleData:
            schedule_data = json.loads(user.ScheduleData)
            _, groups = Grup(schedule_data)
            return jsonify({'count': len(groups), 'groups': groups})
        else:
            return jsonify({'count': 0, 'groups': []})
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode JSON"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-group', methods=['POST'])
def add_group():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    try:
        data = request.json.get('data')
        new_group = Group(name=data['name'], courses=data['courses'], language=data['language'])

        add_data_to_json(user_id, 'Group', new_group)
        return jsonify({'message': 'Group added successfully'}), 200
    except KeyError as e:
        return jsonify({'error': f'Missing key {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/rooms')
def get_office_data():
    user_id = get_current_user_id()
    user = User.query.get(user_id)
    if not user or not user.ScheduleData:
        return jsonify({"error": "No schedule data found"}), 404

    try:
        if user.ScheduleData:
            schedule_data = json.loads(user.ScheduleData)
            _, offices = Office(schedule_data)
            return jsonify({'count': len(offices), 'offices': offices})
        else:
            return jsonify({'count': 0, 'offices': []})
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode JSON"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-room', methods=['POST'])
def add_room():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    try:
        data = request.json.get('data')
        new_office = Offices(name=data['name'], office_type=data['office_type'])

        add_data_to_json(user_id, 'Office', new_office)
        return jsonify({'message': 'Room added successfully'}), 200
    except KeyError as e:
        return jsonify({'error': f'Missing key {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_the_schedule():
    G, colors = create_graph_and_apply_coloring(get_current_user_id())
    df = create_schedule_dataframe(G, colors)
    save_schedule_as_image(df, 'weekly_schedule.png')


@app.route('/courses')
def get_course_data():
    user_id = get_current_user_id()
    user = User.query.get(user_id)
    if not user or not user.ScheduleData:
        return jsonify({"error": "No schedule data found"}), 404

    try:
        if user.ScheduleData:
            schedule_data = json.loads(user.ScheduleData)
            courses = [entry['data'] for entry in schedule_data if entry['type'] == 'Course']
            return jsonify({'count': len(courses), 'courses': courses})
        else:
            return jsonify({'count': 0, 'courses': []})
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to decode JSON"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-course', methods=['POST'])
def add_course():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    try:
        data = request.json.get('data')
        new_course = {
            "type": "Course",
            "data": {
                "name": data['name'],
                "course_type": data['course_type']
            }
        }

        add_data_to_json(user_id, 'Course', new_course)
        return jsonify({'message': 'Course added successfully'}), 200
    except KeyError as e:
        return jsonify({'error': f'Missing key {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/dashboard')
def get_stats():
    user_id = get_current_user_id()
    user = User.query.get(user_id)
    if not user or not user.ScheduleData:
        return jsonify({"groups": 0, "courses": 0, "professors": 0})

    try:
        if user.ScheduleData:
            schedule_data = json.loads(user.ScheduleData)
            groups = len([entry for entry in schedule_data if entry['type'] == 'Group'])
            courses = len([entry for entry in schedule_data if entry['type'] == 'Course'])
            professors = len([entry for entry in schedule_data if entry['type'] == 'Teacher'])
            return jsonify({"groups": groups, "courses": courses, "professors": professors})
        else:
            return jsonify({"groups": 0, "courses": 0, "professors": 0})
    except json.JSONDecodeError:
        return jsonify({"groups": 0, "courses": 0, "professors": 0})
    except Exception as e:
        return jsonify({"error": str(e)})





def get_current_user_id():
    user_id = session.get('user_id', None)
    if user_id is None:
        return None
    return user_id

if __name__ == "__main__":
    app.run(port=5000)

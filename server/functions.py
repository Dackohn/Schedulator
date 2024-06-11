import json
from classes import Teacher, Group, Offices
from models import db, User

def load_data_from_json(user_id):
    user = User.query.get(user_id)
    data = json.loads(user.ScheduleData)
    teachers, groups, offices = [], [], []
    for entry in data:
        if entry['type'] == 'Teacher':
            teacher_data = entry['data']
            teachers.append(Teacher(teacher_data['name'], [(course[0], course[1]) for course in teacher_data['courses']], teacher_data['language']))
        elif entry['type'] == 'Group':
            group_data = entry['data']
            groups.append(Group(group_data['name'], [(course[0], course[1], course[2]) for course in group_data['courses'] if len(course) == 3], group_data['language']))
        elif entry['type'] == 'Office':
            office_data = entry['data']
            offices.append(Offices(office_data['name'], office_data['office_type']))
    return teachers, groups, offices

def Teach(teachers):
    teach_list = []
    for entry in teachers:
        if entry['type'] == 'Teacher':
            teacher_data = entry['data']
            formatted_teacher = {
                'name': teacher_data['name'],
                'courses': teacher_data['courses'],
                'language': teacher_data['language']
            }
            teach_list.append(formatted_teacher)
    return len(teach_list), teach_list

def Grup(groups):
    group_list = []
    for entry in groups:
        if entry['type'] == 'Group':
            group_data = entry['data']
            formatted_group = {
                'name': group_data['name'],
                'courses': group_data['courses'],
                'language': group_data['language']
            }
            group_list.append(formatted_group)
    return len(group_list), group_list

def Office(offices):
    office_list = []
    for entry in offices:
        if entry['type'] == 'Office':
            office_data = entry['data']
            formatted_office = {
                'name': office_data['name'],
                'office_type': office_data['office_type']
            }
            office_list.append(formatted_office)
    return len(office_list), office_list

def functions(user_id):
    teachers, groups, offices = load_data_from_json(user_id)
    number_of_teacher, teacher_list = Teach(teachers)
    number_of_groups, group_list = Grup(groups)
    number_of_offices, office_list = Office(offices)
    return number_of_teacher, number_of_groups, number_of_offices, teacher_list, group_list, office_list

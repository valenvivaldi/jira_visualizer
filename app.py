import json
import requests
from flask import Flask, request, jsonify, render_template
from requests.auth import HTTPBasicAuth
from datetime import datetime, timedelta

app = Flask(__name__)

JIRA_URL = ''
DEFAULT_USERNAME = ''
DEFAULT_TOKEN = ''


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/projects', methods=['POST'])
def get_projects():
    return get_project_jira(request)


@app.route('/api/epics', methods=['POST'])
def get_epics():
    return get_epics_jira()


@app.route('/api/tasks', methods=['POST'])
def get_tasks():
    return get_tasks_jira()


@app.route('/api/worklogs', methods=['POST'])
def get_worklogs():
    return get_worklogs_jira()


@app.route('/api/new_worklog', methods=['POST'])
def create_worklog():
    return create_worklog_jira()


def get_project_jira(request):
    data = request.json
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    auth = get_auth(data)
    url = f'{JIRA_URL}/rest/api/3/project/search'
    response = requests.get(url, auth=auth, headers=headers)
    if response.status_code == 200:
        next_page = response.json().get('nextPage')
        projects = response.json()['values']
        while next_page:
            response = requests.get(next_page, auth=auth, headers=headers)
            projects += response.json()['values']
            next_page = response.json().get('nextPage')
        project_names = [project['key'] + ' - ' + project['name'] for project in projects]

        return jsonify({'projects': project_names})
    return jsonify({'error': 'Error fetching projects'}), response.status_code


def get_epics_jira():
    data = request.data
    data = json.loads(data)
    auth = get_auth(data)
    project = data['project']
    project = project.split(' - ')[0]
    jql = f'project = "{project}" AND issuetype = Epic'
    response = requests.get(f'{JIRA_URL}/rest/api/3/search', params={'jql': jql, 'fields': 'summary'}, auth=auth)
    issues = None
    if response.status_code == 200:
        issues = response.json()['issues']
        next_page = response.json().get('nextPage')
        while next_page:
            response = requests.get(next_page, auth=auth)
            issues += response.json()['issues']
            next_page = response.json().get('nextPage')

        epic_names = [issue['key'] + ' - ' + issue['fields']['summary'] for issue in issues]
        return jsonify({'epics': epic_names})
    return jsonify({'error': 'Error fetching epics'}), response.status_code


def get_auth(data):
    username = data.get('username', DEFAULT_USERNAME)
    if username == '':
        username = DEFAULT_USERNAME
    token = data.get('token', DEFAULT_TOKEN)
    if token == '':
        token = DEFAULT_TOKEN
    auth = HTTPBasicAuth(username, token)
    return auth


def get_tasks_jira():
    data = request.json
    auth = get_auth(data)
    project = data['project'].split(' - ')[0]
    epic = data['epic'].split(' - ')[0] if data.get('epic') else None
    jql = f'project = "{project}"'
    if epic:
        jql += f' AND "Epic Link" = "{epic}"'
    response = requests.get(f'{JIRA_URL}/rest/api/3/search',
                            params={'jql': jql, 'fields': 'key,summary,status,duedate,assignee,timetracking'}, auth=auth)
    if response.status_code == 200:
        issues = response.json()['issues']
        tasks = [{
            'code': issue['key'],
            'name': issue['fields']['summary'],
            'status': issue['fields']['status']['name'],
            'dueDate': issue['fields'].get('duedate'),
            'assignee': get_assignee(issue),
            'originalEstimate': issue['fields'].get('timetracking', {}).get('originalEstimate'),
            'timeSpent': issue['fields'].get('timetracking', {}).get('timeSpent'),
            'link': f'{JIRA_URL}/browse/{issue["key"]}'
        } for issue in issues]
        tasks.sort(key=lambda task: task['code'])  # Ordena las tareas por código
        return jsonify({'tasks': tasks})
    return jsonify({'error': 'Error fetching tasks'}), response.status_code


def get_assignee(issue):
    assignee = issue['fields'].get('assignee')
    if assignee:
        return assignee['displayName']
    return 'Sin asignar'


def get_worklogs_jira():
    data = request.json
    auth = get_auth(data)
    task_code = data['task_code']
    days_since = data['days_since']
    
    # Calculate the start date
    end_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    start_date = end_date - timedelta(days=days_since)

    # Format dates to string
    start_date_str = start_date.strftime('%Y-%m-%dT%H:%M:%S.000+0000')
    end_date_str = end_date.strftime('%Y-%m-%dT%H:%M:%S.000+0000')

    url = f'{JIRA_URL}/rest/api/3/issue/{task_code}/worklog'
    response = requests.get(url, auth=auth)
    
    if response.status_code == 200:
        worklogs = response.json()['worklogs']
        filtered_worklogs = [
            {
                'author': worklog['author']['displayName'],
                'timeSpent': worklog['timeSpent'],
                'started': worklog['started']
            }
            for worklog in worklogs
            if start_date_str <= worklog['started'] < end_date_str
        ]
        return jsonify({'worklogs': filtered_worklogs})
    return jsonify({'error': 'Error fetching worklogs'}), response.status_code


def create_worklog_jira():
    data = request.json
    auth = get_auth(data)
    task_code = data['task_code']
    started = data['started']
    time_spent = data['time_spent']
    
    worklog = {
        'started': started,
        'timeSpent': time_spent
    }
    
    url = f'{JIRA_URL}/rest/api/3/issue/{task_code}/worklog'
    response = requests.post(url, auth=auth, json=worklog)
    
    if response.status_code == 201:
        return jsonify({'message': 'Worklog created successfully'})
    return jsonify({'error': 'Error creating worklog'}), response.status_code


if __name__ == '__main__':
    app.run(debug=True, port=5010)
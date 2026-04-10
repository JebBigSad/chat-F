from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from database import db, init_db
from models import User, Like, Match, Message
import bcrypt
from datetime import timedelta
import json

app = Flask(__name__)

# Настройка CORS - разрешаем все запросы с frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

init_db(app)
jwt = JWTManager(app)

# Функция расчета совместимости
def calculate_compatibility(user, profile):
    score = 0
    
    if user.age and profile.age:
        age_diff = abs(user.age - profile.age)
        age_score = max(0, 50 - age_diff * 5)
        score += age_score
    
    user_interests = json.loads(user.interests) if user.interests else []
    profile_interests = json.loads(profile.interests) if profile.interests else []
    common_interests = len([i for i in user_interests if i in profile_interests])
    interest_score = min(50, common_interests * 10)
    score += interest_score
    
    if user.looking_for == profile.gender:
        score += 10
    
    return min(score, 100)

# Регистрация
@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response, 200
        
    try:
        data = request.json
        print("Received registration data:", data)
        
        # Проверка на существующего пользователя
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Создаем пользователя (БЕЗ ГЕОЛОКАЦИИ)
        user = User(
            email=data['email'],
            username=data['username'],
            password_hash=hashed_password.decode('utf-8'),
            name=data.get('name'),
            age=data.get('age'),
            gender=data.get('gender'),
            looking_for=data.get('looking_for'),
            bio=data.get('bio', ''),
            city=data.get('city', ''),
            interests=json.dumps(data.get('interests', [])),
            photos=json.dumps(data.get('photos', []))
        )
        
        db.session.add(user)
        db.session.commit()
        
        print(f"User created successfully: {user.email}")
        response = jsonify({'message': 'User created successfully'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        return response, 201
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Логин
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        return response, 200
        
    try:
        data = request.json
        user = User.query.filter_by(email=data['email']).first()
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
            response = jsonify({
                'token': access_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': user.name,
                    'age': user.age,
                    'gender': user.gender,
                    'looking_for': user.looking_for,
                    'bio': user.bio,
                    'city': user.city,
                    'interests': json.loads(user.interests) if user.interests else []
                }
            })
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            return response, 200
        
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

# Остальные эндпоинты (discover, like, matches, messages, profile)
# Добавьте их здесь с аналогичной обработкой OPTIONS

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
#!/usr/bin/env python3
from app import app
from app.models import db, User, Product
import requests

def test_database():
    with app.app_context():
        try:
            print("=== DATABASE CONNECTION TEST ===")
            print(f"Database URL: {db.engine.url}")
            
            # Test basic query
            user_count = User.query.count()
            product_count = Product.query.count()
            
            print(f"Users in database: {user_count}")
            print(f"Products in database: {product_count}")
            print("✅ Database connection: SUCCESS")
            
            # Test other models
            from app.models import Review
            review_count = Review.query.count()
            print(f"✅ Database tables: Users({user_count}), Products({product_count}), Reviews({review_count})")
            
        except Exception as e:
            print(f"❌ Database connection: FAILED - {e}")

def test_csrf_endpoints():
    print("\n=== CSRF DEBUG ENDPOINTS TEST ===")
    base_url = "http://localhost:5000"
    
    try:
        # Test debug endpoint
        response = requests.get(f"{base_url}/api/csrf/debug")
        if response.status_code == 200:
            print("✅ CSRF Debug endpoint: SUCCESS")
            data = response.json()
            print(f"   CSRF Token generated: {data['csrf_token'][:20]}...")
            print(f"   Secret key set: {data['environment']['SECRET_KEY_SET']}")
        else:
            print(f"❌ CSRF Debug endpoint: FAILED - Status {response.status_code}")
            
        # Test validation endpoint
        test_data = {"csrf_token": "invalid_token"}
        response = requests.post(f"{base_url}/api/csrf/validate", json=test_data)
        if response.status_code in [400, 500]:  # Expected to fail with invalid token
            print("✅ CSRF Validation endpoint: SUCCESS (correctly rejecting invalid token)")
        else:
            print(f"❌ CSRF Validation endpoint: UNEXPECTED - Status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ CSRF endpoints: FAILED - Cannot connect to Flask server")
    except Exception as e:
        print(f"❌ CSRF endpoints: FAILED - {e}")

def test_frontend_connection():
    print("\n=== FRONTEND CONNECTION TEST ===")
    try:
        response = requests.get("http://localhost:5174")
        if response.status_code == 200:
            print("✅ React frontend: SUCCESS")
        else:
            print(f"❌ React frontend: FAILED - Status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ React frontend: FAILED - Cannot connect to Vite server")
    except Exception as e:
        print(f"❌ React frontend: FAILED - {e}")

def test_api_routes():
    print("\n=== API ROUTES TEST ===")
    base_url = "http://localhost:5000"
    endpoints = [
        "/api/auth/",
        "/api/products/",
        "/api/csrf/debug"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code in [200, 401]:  # 401 is expected for auth without login
                print(f"✅ {endpoint}: SUCCESS")
            else:
                print(f"❌ {endpoint}: FAILED - Status {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint}: FAILED - {e}")

if __name__ == "__main__":
    print("🔧 COMPREHENSIVE DEBUGGING TEST SUITE")
    print("=" * 50)
    
    test_database()
    test_csrf_endpoints()
    test_frontend_connection()
    test_api_routes()
    
    print("\n=== TEST SUMMARY ===")
    print("All debugging tools and endpoints have been tested.")
    print("Check the results above for any issues that need attention.")
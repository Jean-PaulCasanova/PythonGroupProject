#!/usr/bin/env python3
"""
Flask Product Routes - Integration & Testing Guide
A comprehensive script for testing and integrating Flask product API routes.
"""

import sys
import requests
import json
from pathlib import Path
from typing import Dict, Any, Tuple

def print_header(title: str) -> None:
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)

def integration_guide() -> None:
    """Display integration guide"""
    print("\n📋 INTEGRATION GUIDE:")
    print("   1. Replace your product_routes.py with the fixed version")
    print("   2. Run database migrations if needed")
    print("   3. Start your Flask server")
    print("   4. Run this script to test endpoints")
    print("   5. Deploy with confidence!")

def create_integration_files(project_dir: Path) -> None:
    """Create sample integration files"""
    print("\n📁 Creating integration files...")
    
    # Sample integration file
    integration_sample = project_dir / "integration_sample.py"
    sample_content = '''# Sample Flask app integration
from flask import Flask
from app.api.product_routes import product_routes

app = Flask(__name__)
app.register_blueprint(product_routes, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=3967)
'''
    
    try:
        with open(integration_sample, 'w') as f:
            f.write(sample_content)
        print(f"   ✅ Created: {integration_sample}")
    except Exception as e:
        print(f"   ❌ Failed to create integration sample: {e}")
    
    # Requirements additions
    requirements_file = project_dir / "requirements_additions.txt"
    requirements_content = '''# Additional dependencies for product routes
requests>=2.28.0
flask-cors>=4.0.0
sqlalchemy>=1.4.0
'''
    
    try:
        with open(requirements_file, 'w') as f:
            f.write(requirements_content)
        print(f"   ✅ Created: {requirements_file}")
    except Exception as e:
        print(f"   ❌ Failed to create requirements file: {e}")

def test_endpoint(url: str, method: str = 'GET', data: Dict[str, Any] = None) -> Tuple[bool, Dict[str, Any]]:
    """Test a single API endpoint"""
    try:
        if method.upper() == 'GET':
            response = requests.get(url, timeout=10)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, timeout=10)
        else:
            return False, {'error': f'Unsupported method: {method}'}
        
        return True, {
            'status_code': response.status_code,
            'success': 200 <= response.status_code < 300,
            'data': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]
        }
    except requests.exceptions.RequestException as e:
        return False, {'error': str(e)}
    except Exception as e:
        return False, {'error': f'Unexpected error: {str(e)}'}

def run_tests() -> Dict[str, bool]:
    """Run comprehensive API tests"""
    print("\n🧪 RUNNING API TESTS...")
    
    # Test configurations
    local_base = "http://localhost:3967"
    render_base = "https://genrebanned.onrender.com"
    
    endpoints = [
        ('/api/products/', 'GET'),
        ('/api/products/health', 'GET'),
    ]
    
    results = {
        'local_working': True,
        'render_working': True
    }
    
    # Test local environment
    print("\n🏠 Testing Local Environment:")
    for endpoint, method in endpoints:
        url = f"{local_base}{endpoint}"
        print(f"   Testing {method} {url}...")
        
        success, result = test_endpoint(url, method)
        if success and result['success']:
            print(f"   ✅ {endpoint}: OK (Status: {result['status_code']})")
        else:
            print(f"   ❌ {endpoint}: FAILED")
            if 'error' in result:
                print(f"      Error: {result['error']}")
            else:
                print(f"      Status: {result.get('status_code', 'Unknown')}")
            results['local_working'] = False
    
    # Test Render environment
    print("\n☁️  Testing Render Environment:")
    for endpoint, method in endpoints:
        url = f"{render_base}{endpoint}"
        print(f"   Testing {method} {url}...")
        
        success, result = test_endpoint(url, method)
        if success and result['success']:
            print(f"   ✅ {endpoint}: OK (Status: {result['status_code']})")
        else:
            print(f"   ❌ {endpoint}: FAILED")
            if 'error' in result:
                print(f"      Error: {result['error']}")
            else:
                print(f"      Status: {result.get('status_code', 'Unknown')}")
            results['render_working'] = False
    
    return results

def provide_recommendations(results: Dict[str, bool]) -> None:
    """Provide recommendations based on test results"""
    print("\n📊 TEST RESULTS & RECOMMENDATIONS:")
    
    local_working = results.get('local_working', False)
    render_working = results.get('render_working', False)
    
    if local_working and render_working:
        print("🎉 EXCELLENT! Both environments are working correctly.")
        print("\n✅ Next steps:")
        print("   1. Your API is ready for production use")
        print("   2. Consider adding more comprehensive tests")
        print("   3. Set up monitoring for the production environment")
        
    elif local_working and not render_working:
        print("⚠️  Local development is working, but Render deployment needs attention.")
        print("\n🔧 Render fixes to try:")
        print("   1. Check Render deployment logs for errors")
        print("   2. Verify environment variables are set correctly")
        print("   3. Ensure database migrations have been run on Render")
        print("   4. Check if Render app is sleeping (cold start issue)")
        
    elif not local_working and render_working:
        print("⚠️  Render deployment is working, but local development needs attention.")
        print("\n🔧 Local fixes to try:")
        print("   1. Ensure your local Flask server is running on port 3967")
        print("   2. Check local database setup and migrations")
        print("   3. Verify local environment variables")
        print("   4. Check for any import or dependency issues")
        
    else:
        print("❌ Both environments need attention.")
        print("\n🔧 Critical fixes needed:")
        print("   1. Replace your product_routes.py with the fixed version")
        print("   2. Run the database health checker")
        print("   3. Check server logs for specific error messages")
        print("   4. Verify your Product model matches expected structure")
        print("   5. Ensure all required dependencies are installed")
    
    print("\n💡 General recommendations:")
    print("   - Always test locally before deploying to production")
    print("   - Set up proper logging to catch issues early")
    print("   - Use the health check endpoints for monitoring")
    print("   - Keep your database schema consistent across environments")

def main():
    """Main function"""
    print_header("FLASK PRODUCT ROUTES - INTEGRATION & TESTING")
    
    # Check if we're in a Flask project directory
    current_dir = Path.cwd()
    flask_indicators = [
        current_dir / 'app.py',
        current_dir / 'main.py',
        current_dir / 'run.py',
        current_dir / 'requirements.txt'
    ]
    
    is_flask_project = any(indicator.exists() for indicator in flask_indicators)
    
    if is_flask_project:
        print(f"✅ Detected Flask project in: {current_dir}")
    else:
        print(f"⚠️  No Flask project detected in: {current_dir}")
        print("   Make sure you're in your Flask project directory")
    
    # Show integration guide
    integration_guide()
    
    # Create integration files if in a Flask project
    if is_flask_project:
        create_integration_files(current_dir)
    
    # Ask user if they want to run tests
    print("\n🔍 Would you like to run API tests now?")
    print("   Make sure your Flask server is running first!")
    
    try:
        response = input("\nRun tests? (y/N): ").strip().lower()
        if response in ['y', 'yes']:
            results = run_tests()
            provide_recommendations(results)
        else:
            print("Skipping tests. You can run them later with this script.")
    except KeyboardInterrupt:
        print("\n⏹️  Interrupted by user")
    
    print("\n🎯 SUMMARY:")
    print("   1. Use the fixed product_routes.py from the first artifact")
    print("   2. Run the database health checker from the second artifact")
    print("   3. Test your API endpoints")
    print("   4. Deploy with confidence!")
    
    print(f"\n📁 Generated files in {current_dir}:")
    print("   - integration_sample.py (sample Flask app integration)")
    print("   - requirements_additions.txt (additional dependencies)")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n⏹️  Integration guide interrupted")
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        sys.exit(1)
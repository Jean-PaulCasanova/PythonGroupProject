#!/usr/bin/env python3
"""
Comprehensive Product API Endpoint Tester
Tests product creation at http://localhost:3967/products/new
"""

import requests
import json
import time
from datetime import datetime
import sys
import re
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

class ProductAPITester:
    def __init__(self, base_url="http://localhost:8444", email="east@east.com", password="password"):
        self.base_url = base_url
        self.email = email
        self.password = password
        self.session = requests.Session()
        self.csrf_token = None
        self.debug = True
        
    def log(self, message, data=None):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {message}")
        if data and self.debug:
            print(f"    Data: {data}")
    
    def error(self, message, data=None):
        print(f"❌ ERROR: {message}")
        if data:
            print(f"    Details: {data}")
    
    def success(self, message):
        print(f"✅ SUCCESS: {message}")
    
    def detect_framework(self, html_content):
        """Detect web framework from HTML content"""
        frameworks = {
            'django': [
                'csrfmiddlewaretoken',
                'Django administration',
                'django.contrib'
            ],
            'rails': [
                'authenticity_token',
                'csrf-token',
                'Rails.application'
            ],
            'flask': [
                'csrf_token',
                'Flask',
                'WTF'
            ],
            'express': [
                '_csrf',
                'express-session'
            ]
        }
        
        html_lower = html_content.lower()
        detected = []
        
        for framework, indicators in frameworks.items():
            for indicator in indicators:
                if indicator.lower() in html_lower:
                    detected.append(framework)
                    break
        
        return detected[0] if detected else 'unknown'
    
    def extract_csrf_token(self, html_content):
        """Extract CSRF token from HTML"""
        patterns = [
            r'name=["\']csrf[_-]?token["\'].*?value=["\']([^"\']+)["\']',
            r'name=["\']authenticity_token["\'].*?value=["\']([^"\']+)["\']',
            r'name=["\']csrfmiddlewaretoken["\'].*?value=["\']([^"\']+)["\']',
            r'name=["\']_csrf["\'].*?value=["\']([^"\']+)["\']',
            r'csrf[_-]?token["\']?\s*:\s*["\']([^"\']+)["\']',
            r'content=["\']([^"\']+)["\'].*?name=["\']csrf-token["\']'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html_content, re.IGNORECASE | re.DOTALL)
            if match:
                token = match.group(1)
                self.log(f"CSRF token found: {token[:20]}...")
                return token
        
        return None
    
    def test_connection(self):
        """Test basic connection to the application"""
        try:
            response = self.session.get(self.base_url, timeout=10)
            self.success(f"Connection established - Status: {response.status_code}")
            
            framework = self.detect_framework(response.text)
            self.log(f"Detected framework: {framework}")
            
            return True
        except requests.exceptions.RequestException as e:
            self.error(f"Connection failed: {e}")
            return False
    
    def attempt_login(self):
        """Attempt to login with multiple strategies"""
        login_endpoints = [
            '/login',
            '/signin',
            '/auth/login',
            '/users/sign_in',
            '/session/new',
            '/admin/login'
        ]
        
        # First, check if already logged in
        try:
            response = self.session.get(urljoin(self.base_url, '/products/new'))
            if response.status_code == 200 and 'login' not in response.url.lower():
                self.success("Already logged in or no authentication required")
                return True
        except:
            pass
        
        # Try each login endpoint
        for endpoint in login_endpoints:
            try:
                login_url = urljoin(self.base_url, endpoint)
                self.log(f"Trying login endpoint: {endpoint}")
                
                # Get login page
                response = self.session.get(login_url)
                if response.status_code != 200:
                    continue
                
                # Extract CSRF token
                self.csrf_token = self.extract_csrf_token(response.text)
                
                # Prepare login data
                login_data = {
                    'email': self.email,
                    'password': self.password,
                    'username': self.email,  # Some apps use username
                    'user[email]': self.email,  # Rails nested params
                    'user[password]': self.password
                }
                
                # Add CSRF tokens
                if self.csrf_token:
                    login_data.update({
                        'authenticity_token': self.csrf_token,
                        'csrfmiddlewaretoken': self.csrf_token,
                        '_csrf': self.csrf_token,
                        'csrf_token': self.csrf_token
                    })
                
                # Attempt login
                response = self.session.post(login_url, data=login_data, allow_redirects=True)
                
                # Check if login was successful
                if (response.status_code in [200, 302] and 
                    ('dashboard' in response.url or 
                     'products' in response.url or
                     'admin' in response.url or
                     'login' not in response.url)):
                    self.success(f"Login successful via {endpoint}")
                    return True
                    
            except Exception as e:
                self.log(f"Login attempt failed for {endpoint}: {e}")
                continue
        
        self.error("All login attempts failed")
        return False
    
    def get_product_form(self):
        """Get the product creation form"""
        try:
            url = urljoin(self.base_url, '/products/new')
            response = self.session.get(url)
            
            if response.status_code != 200:
                self.error(f"Cannot access product form - Status: {response.status_code}")
                return None, None
            
            # Extract CSRF token from form page
            self.csrf_token = self.extract_csrf_token(response.text)
            
            # Parse form fields using BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            forms = soup.find_all('form')
            
            if not forms:
                self.error("No forms found on product page")
                return None, response.text
            
            # Analyze form structure
            form = forms[0]  # Assume first form is the product form
            form_info = {
                'action': form.get('action', ''),
                'method': form.get('method', 'post').upper(),
                'enctype': form.get('enctype', ''),
                'fields': []
            }
            
            # Extract all input fields
            inputs = form.find_all(['input', 'select', 'textarea'])
            for inp in inputs:
                field_info = {
                    'name': inp.get('name', ''),
                    'type': inp.get('type', 'text'),
                    'required': inp.has_attr('required'),
                    'placeholder': inp.get('placeholder', ''),
                    'value': inp.get('value', '')
                }
                form_info['fields'].append(field_info)
            
            self.log("Form structure analyzed", form_info)
            return form_info, response.text
            
        except Exception as e:
            self.error(f"Failed to get product form: {e}")
            return None, None
    
    def generate_test_data(self):
        """Generate test product data"""
        timestamp = int(time.time())
        return {
            'name': f'Debug Test Product {timestamp}',
            'description': 'This is a test product created by the debug script',
            'price': '99.99',
            'category': 'Electronics',
            'sku': f'TEST-{timestamp}',
            'quantity': '10',
            'brand': 'TestBrand',
            'status': 'active',
            'weight': '1.5',
            'dimensions': '10x10x10',
            'color': 'Black',
            'material': 'Plastic'
        }
    
    def map_form_fields(self, form_info, test_data):
        """Map test data to actual form fields"""
        mapped_data = {}
        
        # Get list of actual field names
        field_names = [field['name'] for field in form_info['fields'] if field['name']]
        
        # Common field mappings
        mappings = {
            'name': ['name', 'product_name', 'title', 'product[name]'],
            'description': ['description', 'desc', 'product_description', 'product[description]'],
            'price': ['price', 'cost', 'amount', 'product_price', 'product[price]'],
            'category': ['category', 'category_id', 'product_category', 'product[category]'],
            'sku': ['sku', 'product_sku', 'product[sku]'],
            'quantity': ['quantity', 'stock', 'inventory', 'product[quantity]'],
            'brand': ['brand', 'manufacturer', 'product[brand]'],
            'status': ['status', 'state', 'product[status]']
        }
        
        # Map test data to form fields
        for data_key, data_value in test_data.items():
            possible_names = mappings.get(data_key, [data_key])
            
            for possible_name in possible_names:
                if possible_name in field_names:
                    mapped_data[possible_name] = data_value
                    self.log(f"Mapped {data_key} -> {possible_name}")
                    break
        
        # Add CSRF token
        if self.csrf_token:
            csrf_fields = ['authenticity_token', 'csrfmiddlewaretoken', '_csrf', 'csrf_token']
            for csrf_field in csrf_fields:
                if any(field['name'] == csrf_field for field in form_info['fields']):
                    mapped_data[csrf_field] = self.csrf_token
                    break
        
        return mapped_data
    
    def test_product_creation(self, form_info, test_data):
        """Test product creation with various scenarios"""
        results = []
        
        # Test 1: Complete valid data
        self.log("Test 1: Creating product with complete data")
        mapped_data = self.map_form_fields(form_info, test_data)
        result = self.submit_product(form_info, mapped_data, "Complete Data Test")
        results.append(result)
        
        # Test 2: Minimal required data only
        self.log("Test 2: Creating product with minimal data")
        minimal_data = {k: v for k, v in test_data.items() if k in ['name', 'price']}
        mapped_minimal = self.map_form_fields(form_info, minimal_data)
        result = self.submit_product(form_info, mapped_minimal, "Minimal Data Test")
        results.append(result)
        
        # Test 3: Missing required fields
        self.log("Test 3: Testing validation with missing fields")
        invalid_data = {k: v for k, v in test_data.items() if k != 'name'}
        mapped_invalid = self.map_form_fields(form_info, invalid_data)
        result = self.submit_product(form_info, mapped_invalid, "Missing Required Field Test")
        results.append(result)
        
        # Test 4: Invalid data types
        self.log("Test 4: Testing with invalid data types")
        invalid_type_data = test_data.copy()
        invalid_type_data['price'] = 'not-a-number'
        invalid_type_data['quantity'] = 'not-an-integer'
        mapped_invalid_type = self.map_form_fields(form_info, invalid_type_data)
        result = self.submit_product(form_info, mapped_invalid_type, "Invalid Data Types Test")
        results.append(result)
        
        return results
    
    def submit_product(self, form_info, data, test_name):
        """Submit product data and analyze response"""
        try:
            # Determine submission URL
            action = form_info.get('action', '')
            if action:
                if action.startswith('http'):
                    submit_url = action
                else:
                    submit_url = urljoin(self.base_url, action)
            else:
                submit_url = urljoin(self.base_url, '/products')
            
            self.log(f"Submitting to: {submit_url}")
            self.log(f"Data: {data}")
            
            # Submit form
            response = self.session.post(submit_url, data=data, allow_redirects=True)
            
            # Analyze response
            result = {
                'test_name': test_name,
                'status_code': response.status_code,
                'url': response.url,
                'success': False,
                'message': '',
                'response_snippet': response.text[:500] if response.text else ''
            }
            
            # Determine success
            if response.status_code == 200:
                if any(keyword in response.text.lower() for keyword in 
                       ['success', 'created', 'saved', 'added']):
                    result['success'] = True
                    result['message'] = 'Product created successfully'
                elif any(keyword in response.text.lower() for keyword in 
                         ['error', 'invalid', 'failed', 'required']):
                    result['message'] = 'Validation errors detected'
                else:
                    result['message'] = 'Response unclear - check manually'
            elif response.status_code == 302:
                result['success'] = True
                result['message'] = f'Redirect to: {response.url}'
            elif response.status_code == 422:
                result['message'] = 'Validation failed'
            else:
                result['message'] = f'HTTP {response.status_code} error'
            
            # Log result
            status = "✅" if result['success'] else "❌"
            self.log(f"{status} {test_name}: {result['message']}")
            
            return result
            
        except Exception as e:
            result = {
                'test_name': test_name,
                'success': False,
                'error': str(e),
                'message': f'Exception occurred: {e}'
            }
            self.error(f"{test_name} failed: {e}")
            return result
    
    def run_comprehensive_test(self):
        """Run complete test suite"""
        print("🚀 Starting Comprehensive Product Creation Test")
        print("=" * 50)
        
        # Step 1: Test connection
        if not self.test_connection():
            return False
        
        # Step 2: Attempt login
        if not self.attempt_login():
            self.log("Continuing without login (might be open endpoint)")
        
        # Step 3: Get product form
        form_info, html_content = self.get_product_form()
        if not form_info:
            return False
        
        # Step 4: Generate test data
        test_data = self.generate_test_data()
        
        # Step 5: Run tests
        results = self.test_product_creation(form_info, test_data)
        
        # Step 6: Summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        successful_tests = sum(1 for r in results if r['success'])
        total_tests = len(results)
        
        print(f"Tests run: {total_tests}")
        print(f"Successful: {successful_tests}")
        print(f"Failed: {total_tests - successful_tests}")
        
        print("\nDetailed Results:")
        for result in results:
            status = "✅ PASS" if result['success'] else "❌ FAIL"
            print(f"  {status}: {result['test_name']} - {result['message']}")
        
        # Recommendations
        print("\n🔧 RECOMMENDATIONS:")
        if successful_tests == 0:
            print("- Check if the server is running on port 3967")
            print("- Verify the /products/new endpoint exists")
            print("- Check authentication requirements")
            print("- Review server logs for errors")
        elif successful_tests < total_tests:
            print("- Some tests failed - check validation logic")
            print("- Review required vs optional fields")
            print("- Check data type validations")
        else:
            print("- All tests passed! Product creation is working correctly")
        
        return successful_tests > 0

def main():
    """Main execution function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Test product creation endpoint')
    parser.add_argument('--url', default='http://localhost:8444', 
                       help='Base URL of the application')
    parser.add_argument('--email', default='east@east.com', 
                       help='Login email')
    parser.add_argument('--password', default='password', 
                       help='Login password')
    parser.add_argument('--debug', action='store_true', 
                       help='Enable debug output')
    
    args = parser.parse_args()
    
    tester = ProductAPITester(args.url, args.email, args.password)
    tester.debug = args.debug
    
    try:
        success = tester.run_comprehensive_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
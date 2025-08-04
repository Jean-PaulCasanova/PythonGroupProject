#!/usr/bin/env python3
"""
Remote database initialization script
This script calls the API to initialize the database
"""

import requests
import json
import time

API_BASE = "https://genrebanned.onrender.com"

def test_health():
    """Test if the API is responding"""
    try:
        response = requests.get(f"{API_BASE}/api/products/health", timeout=10)
        print(f"Health check: {response.status_code} - {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def init_database():
    """Initialize the database via API"""
    try:
        response = requests.post(
            f"{API_BASE}/api/database/init",
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"Database init: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Database init failed: {e}")
        return False

def test_products():
    """Test the products endpoint"""
    try:
        response = requests.get(f"{API_BASE}/api/products/", timeout=10)
        print(f"Products test: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Products found: {len(data.get('data', []))}")
            if data.get('data'):
                print(f"First product: {data['data'][0].get('title', 'No title')}")
        else:
            print(f"Error response: {response.text[:200]}")
        return response.status_code == 200
    except Exception as e:
        print(f"Products test failed: {e}")
        return False

def test_debug():
    """Test the debug endpoint"""
    try:
        response = requests.get(f"{API_BASE}/api/database/debug", timeout=10)
        print(f"Debug test: {response.status_code}")
        print(f"Debug response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Debug test failed: {e}")
        return False

if __name__ == "__main__":
    print("=== Remote Database Initialization ===")
    
    print("\n1. Testing API health...")
    if not test_health():
        print("API is not responding. Exiting.")
        exit(1)
    
    print("\n2. Testing debug endpoint...")
    test_debug()
    
    print("\n3. Attempting database initialization...")
    if init_database():
        print("Database initialization successful!")
    else:
        print("Database initialization failed.")
    
    print("\n4. Testing products endpoint...")
    test_products()
    
    print("\n5. Final debug check...")
    test_debug()
    
    print("\n=== Initialization Complete ===")
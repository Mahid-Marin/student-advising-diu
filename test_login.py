#!/usr/bin/env python3
import urllib.request
import json

data = json.dumps({'email': 'student@example.com', 'password': 'password'}).encode('utf-8')
try:
    req = urllib.request.Request(
        'http://127.0.0.1:8080/api/auth/login',
        data=data,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=5) as response:
        print(f"Status: {response.status}")
        body = response.read().decode('utf-8')
        print(f"Response: {body}")
        result = json.loads(body)
        print(f"Parsed: {json.dumps(result, indent=2)}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}")
    body = e.read().decode('utf-8')
    print(f"Response body: {body}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")

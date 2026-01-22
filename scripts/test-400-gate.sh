#!/bin/bash
API_URL="http://localhost:3001/ml.predict"

echo "🧪 Testing MNIST API Security Perimeter"
echo "========================================"

# Test 1: Valid input (should pass)
echo -e "\n✅ Test 1: Valid input (should return 200)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/png;base64,ABC==","sessionId":"123e4567-e89b-12d3-a456-426614174000"}' \
  | jq -r 'if .result then "PASS: Got 200 with prediction" else "FAIL: " + (.error.message // "Unknown error") end'

# Test 2: Whitespace injection (should fail)
echo -e "\n🚫 Test 2: Whitespace injection (should return 400)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/png;base64,ABC DEF==","sessionId":"123e4567-e89b-12d3-a456-426614174000"}' \
  | jq -r 'if .error then "PASS: Blocked with - " + .error.message else "FAIL: Should have rejected" end'

# Test 3: JPEG smuggling (should fail)
echo -e "\n🚫 Test 3: JPEG media type (should return 400)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/jpeg;base64,ABC==","sessionId":"123e4567-e89b-12d3-a456-426614174000"}' \
  | jq -r 'if .error then "PASS: Blocked with - " + .error.message else "FAIL: Should have rejected" end'

# Test 4: Invalid padding (should fail)
echo -e "\n🚫 Test 4: Triple padding (should return 400)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/png;base64,ABC===","sessionId":"123e4567-e89b-12d3-a456-426614174000"}' \
  | jq -r 'if .error then "PASS: Blocked with - " + .error.message else "FAIL: Should have rejected" end'

# Test 5: Invalid UUID (should fail)
echo -e "\n🚫 Test 5: Invalid session ID (should return 400)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/png;base64,ABC==","sessionId":"not-a-uuid"}' \
  | jq -r 'if .error then "PASS: Blocked with - " + .error.message else "FAIL: Should have rejected" end'

# Test 6: Special characters (should fail)
echo -e "\n🚫 Test 6: Special characters (should return 400)"
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"imageData":"data:image/png;base64,ABC@#$==","sessionId":"123e4567-e89b-12d3-a456-426614174000"}' \
  | jq -r 'if .error then "PASS: Blocked with - " + .error.message else "FAIL: Should have rejected" end'

echo -e "\n========================================"
echo "🏁 Security Perimeter Tests Complete"

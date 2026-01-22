#!/bin/bash

# MNIST App - Organization Verification Checklist
# Verify complete monorepo structure and documentation

set -e

echo "🔍 MNIST Digit Recognition - Organization Verification Checklist"
echo "=================================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/"
        return 1
    fi
}

# Track results
total=0
passed=0

echo "📁 DIRECTORY STRUCTURE"
echo "====================="
echo ""

echo "Top-level directories:"
for dir in apps packages docs scripts tools; do
    ((total++))
    if check_dir "$dir"; then ((passed++)); fi
done

echo ""
echo "API Server structure:"
api_dirs=("apps/api/src" "apps/api/src/services" "apps/api/src/middleware" "apps/api/src/routers" "apps/api/tests" "apps/api/tests/integration" "apps/api/tests/unit")
for dir in "${api_dirs[@]}"; do
    ((total++))
    if check_dir "$dir"; then ((passed++)); fi
done

echo ""
echo "Web Application structure:"
web_dirs=("apps/web/src" "apps/web/src/components" "apps/web/src/hooks" "apps/web/src/utils" "apps/web/tests" "apps/web/tests/components")
for dir in "${web_dirs[@]}"; do
    ((total++))
    if check_dir "$dir"; then ((passed++)); fi
done

echo ""
echo "ML Core structure:"
ml_dirs=("packages/ml-core/src" "packages/ml-core/src/model" "packages/ml-core/src/preprocessing" "packages/ml-core/src/inference" "packages/ml-core/tests" "packages/ml-core/scripts" "packages/ml-core/trained-models")
for dir in "${ml_dirs[@]}"; do
    ((total++))
    if check_dir "$dir"; then ((passed++)); fi
done

echo ""
echo "Shared Package structure:"
shared_dirs=("packages/shared/src" "packages/shared/src/schemas" "packages/shared/tests")
for dir in "${shared_dirs[@]}"; do
    ((total++))
    if check_dir "$dir"; then ((passed++)); fi
done

echo ""
echo "📄 DOCUMENTATION FILES"
echo "====================="
echo ""

docs=(
    "README.md"
    "apps/api/README.md"
    "apps/web/README.md"
    "packages/shared/README.md"
    "packages/ml-core/README.md"
    "docs/README.md"
    "docs/MODEL_CARD.md"
    "docs/API_PERSISTENCE.md"
    "docs/TESTING_REPORT.md"
)

for file in "${docs[@]}"; do
    ((total++))
    if check_file "$file"; then ((passed++)); fi
done

echo ""
echo "⚙️ CONFIGURATION FILES"
echo "====================="
echo ""

configs=(
    "package.json"
    "pnpm-workspace.yaml"
    "turbo.json"
    "apps/api/package.json"
    "apps/api/tsconfig.json"
    "apps/web/package.json"
    "apps/web/tsconfig.json"
    "apps/web/vite.config.ts"
    "apps/web/tailwind.config.ts"
    "apps/web/postcss.config.mjs"
    "packages/shared/package.json"
    "packages/shared/tsconfig.json"
    "packages/ml-core/package.json"
    "packages/ml-core/tsconfig.json"
)

for file in "${configs[@]}"; do
    ((total++))
    if check_file "$file"; then ((passed++)); fi
done

echo ""
echo "📦 SOURCE FILES"
echo "==============="
echo ""

sources=(
    "apps/api/src/index.ts"
    "apps/api/src/server.ts"
    "apps/api/src/routers/ml.router.ts"
    "apps/api/src/services/inference.service.ts"
    "apps/web/src/App.tsx"
    "apps/web/src/main.tsx"
    "apps/web/src/index.css"
    "apps/web/src/components/MNISTDigitRecognition.tsx"
    "apps/web/src/utils/canvas.ts"
    "apps/web/src/utils/validation.ts"
    "packages/shared/src/index.ts"
    "packages/shared/src/schemas/ml.schema.ts"
    "packages/ml-core/src/index.ts"
)

for file in "${sources[@]}"; do
    ((total++))
    if check_file "$file"; then ((passed++)); fi
done

echo ""
echo "🧪 TEST SCRIPTS"
echo "==============="
echo ""

scripts=(
    "scripts/test-400-gate.sh"
)

for file in "${scripts[@]}"; do
    ((total++))
    if check_file "$file"; then ((passed++)); fi
done

echo ""
echo "📊 SUMMARY"
echo "=========="
percentage=$((passed * 100 / total))
echo ""
echo "Total items checked: $total"
echo "Items verified: $passed"
echo "Success rate: $percentage%"
echo ""

if [ $passed -eq $total ]; then
    echo -e "${GREEN}✅ All checks passed! Monorepo structure is complete.${NC}"
    echo ""
    echo "🎯 Next Steps:"
    echo "  1. Install dependencies: pnpm install"
    echo "  2. Start API: pnpm run dev:api"
    echo "  3. Start Web: pnpm run dev:web"
    echo "  4. Read docs/README.md for full documentation"
    exit 0
else
    echo -e "${RED}❌ Some items are missing. Please check above for details.${NC}"
    echo ""
    echo "Missing items: $((total - passed))"
    exit 1
fi

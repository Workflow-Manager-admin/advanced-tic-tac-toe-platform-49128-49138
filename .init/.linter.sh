#!/bin/bash
cd /home/kavia/workspace/code-generation/advanced-tic-tac-toe-platform-49128-49138/tic_tac_toe_webapp
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi


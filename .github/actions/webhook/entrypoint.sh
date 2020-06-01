#!/bin/sh
set -eu

curl -X POST "$WEBHOOK_URL"

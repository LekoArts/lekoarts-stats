#!/bin/sh
set -eu

curl -X POST -H "$WEBHOOK_URL"

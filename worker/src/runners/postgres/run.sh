#!/usr/bin/env bash
set -euo pipefail

# Espera un JSON por STDIN con: schema, seed, studentQuery, challengeId
INPUT_JSON="$(cat)"

echo "[postgres-runner] Payload recibido desde el executor" >&2

SCHEMA_SQL="$(echo "$INPUT_JSON" | jq -r '.schema // ""')"
SEED_SQL="$(echo "$INPUT_JSON" | jq -r '.seed // ""')"
STUDENT_QUERY="$(echo "$INPUT_JSON" | jq -r '.studentQuery // ""')"
CHALLENGE_ID="$(echo "$INPUT_JSON" | jq -r '.challengeId // "unknown"')"

echo "[postgres-runner] challengeId=$CHALLENGE_ID" >&2
echo "[postgres-runner] schema_chars=${#SCHEMA_SQL} seed_chars=${#SEED_SQL} query_chars=${#STUDENT_QUERY}" >&2

TMP_DIR="$(mktemp -d)"
DB_NAME="challenge_$(echo "$CHALLENGE_ID" | tr -cd '[:alnum:]' | cut -c1-20)_$RANDOM"
DB_PORT=5432

cleanup() {
  if [ -n "${PG_PID:-}" ] && kill -0 "$PG_PID" 2>/dev/null; then
    pg_ctl -D "$TMP_DIR/pgdata" -m fast stop >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

initdb -D "$TMP_DIR/pgdata" >/dev/null

echo "[postgres-runner] Base de datos temporal inicializada en $TMP_DIR/pgdata" >&2

pg_ctl -D "$TMP_DIR/pgdata" \
  -o "-p $DB_PORT -h 127.0.0.1 -c listen_addresses='127.0.0.1'" \
  -w start >/dev/null

echo "[postgres-runner] Postgres temporal levantado en puerto $DB_PORT" >&2

createdb -h 127.0.0.1 -p "$DB_PORT" "$DB_NAME"

echo "[postgres-runner] Base temporal creada: $DB_NAME" >&2

printf '%s\n' "$SCHEMA_SQL" > "$TMP_DIR/schema.sql"
printf '%s\n' "$SEED_SQL" > "$TMP_DIR/seed.sql"
printf '%s\n' "$STUDENT_QUERY" > "$TMP_DIR/query.sql"

echo "[postgres-runner] Ejecutando schema.sql" >&2

if ! psql -h 127.0.0.1 -p "$DB_PORT" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$TMP_DIR/schema.sql" >/dev/null 2>"$TMP_DIR/schema.err"; then
  ERR_MSG="$(tr -d '\r' < "$TMP_DIR/schema.err" | tail -n 20)"
  echo "[postgres-runner] Falló schema.sql: $ERR_MSG" >&2
  jq -n --arg err "$ERR_MSG" '{status:"SYNTAX_ERROR", data:null, error:$err, executionTimeMs:0}'
  exit 0
fi

echo "[postgres-runner] Schema aplicado correctamente" >&2

if [ -n "$(printf '%s' "$SEED_SQL" | tr -d '[:space:]')" ]; then
  echo "[postgres-runner] Ejecutando seed.sql" >&2
  if ! psql -h 127.0.0.1 -p "$DB_PORT" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$TMP_DIR/seed.sql" >/dev/null 2>"$TMP_DIR/seed.err"; then
    ERR_MSG="$(tr -d '\r' < "$TMP_DIR/seed.err" | tail -n 20)"
    echo "[postgres-runner] Falló seed.sql: $ERR_MSG" >&2
    jq -n --arg err "$ERR_MSG" '{status:"RUNTIME_ERROR", data:null, error:$err, executionTimeMs:0}'
    exit 0
  fi
  echo "[postgres-runner] Seed aplicado correctamente" >&2
else
  echo "[postgres-runner] Seed vacío, se omite carga de datos" >&2
fi

START_MS="$(date +%s%3N)"
echo "[postgres-runner] Ejecutando query del estudiante" >&2
if ! QUERY_OUTPUT="$(psql -h 127.0.0.1 -p "$DB_PORT" -d "$DB_NAME" -v ON_ERROR_STOP=1 -A -F ',' -P footer=off -f "$TMP_DIR/query.sql" 2>"$TMP_DIR/query.err")"; then
  END_MS="$(date +%s%3N)"
  ELAPSED_MS=$((END_MS - START_MS))
  ERR_MSG="$(tr -d '\r' < "$TMP_DIR/query.err" | tail -n 20)"
  echo "[postgres-runner] Falló query del estudiante: $ERR_MSG" >&2
  jq -n --arg err "$ERR_MSG" --argjson ms "$ELAPSED_MS" '{status:"RUNTIME_ERROR", data:null, error:$err, executionTimeMs:$ms}'
  exit 0
fi
END_MS="$(date +%s%3N)"
ELAPSED_MS=$((END_MS - START_MS))

echo "[postgres-runner] Query ejecutado correctamente en ${ELAPSED_MS}ms" >&2
echo "[postgres-runner] Resultado bruto: $QUERY_OUTPUT" >&2

# Se hace echo del resultado y el tiempo de ejecución.
jq -n \
  --arg output "$QUERY_OUTPUT" \
  --argjson ms "$ELAPSED_MS" \
  '{status:"SUCCESS", data:[{raw:$output}], executionTimeMs:$ms}'

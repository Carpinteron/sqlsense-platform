const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'api', 'swagger.json');
let s = fs.readFileSync(file, 'utf8');

s = s.replace(/"CreateSubmissionDto":\{"type":"object","properties":\{\}\}/g, `"CreateSubmissionDto":{"type":"object","properties":{"challengeId":{"type":"string","example":"550e8400-e29b-41d4-a716-446655440000","description":"ID del reto (UUID v4) a evaluar"},"query":{"type":"string","example":"SELECT * FROM users WHERE id = 1;","description":"Consulta SQL que se enviará al evaluador"}},"required":["challengeId","query"]}`);

s = s.replace(/"SubmissionCreatedResponseDto":\{"type":"object","properties":\{\}\}/g, `"SubmissionCreatedResponseDto":{"type":"object","properties":{"id":{"type":"string","example":"d9f1c2a0-4c3b-4a2a-ae9b-1a2b3c4d5e6f"},"status":{"type":"string","example":"QUEUED","description":"Estado inicial del envío: QUEUED | RUNNING | ACCEPTED | WRONG_ANSWER | SYNTAX_ERROR | RUNTIME_ERROR | TIME_LIMIT_EXCEEDED | OPTIMIZATION_REQUIRED"},"message":{"type":"string","example":"Enviado correctamente"},"executionTimeMs":{"type":"number","example":123,"description":"Tiempo de ejecución en ms (cuando esté disponible)","nullable":true},"result":{"type":"object","description":"Resultado tabular o estructura devuelta por el evaluador cuando aplica","nullable":true}},"required":["id","status","message"]}`);

s = s.replace(/"GenerateExpectedQueryDto":\{"type":"object","properties":\{\}\}/g, `"GenerateExpectedQueryDto":{"type":"object","properties":{"prompt":{"type":"string","example":"SELECT * FROM users WHERE id = ?","minLength":5,"description":"Prompt que describe la consulta esperada"},"schema":{"type":"object","example":{"tables":[{"name":"users","columns":[{"name":"id","type":"int"}]}]},"description":"Objeto que describe el esquema de la base de datos"}},"required":["prompt","schema"]}`);

fs.writeFileSync(file, s, 'utf8');
console.log('swagger.json patched');

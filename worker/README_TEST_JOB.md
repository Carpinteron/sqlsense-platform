
docker run --rm --network backend_sql_sense_network -v $(pwd):/app -w /app node:18-alpine \
                   sh -c "npm install bullmq ioredis && node -e \"
               const { Queue } = require('bullmq');
               const queue = new Queue('submission-queue', { 
                 connection: { host: 'redis', port: 6379 } 
               });
               queue.add('eval-job', { submissionId: 'EVAL-TEST-$(date +%H%M%S)' })
                 .then((job) => { 
                   console.log('✅ Job inyectado con ID:', job.id); 
                   process.exit(0); 
                 })
                 .catch(err => { 
                   console.error('❌ Error:', err); 
                   process.exit(1); 
                 });
               \""
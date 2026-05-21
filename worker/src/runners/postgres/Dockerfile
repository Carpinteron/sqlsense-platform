FROM postgres:16-alpine

RUN apk add --no-cache bash jq

WORKDIR /app

COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

ENTRYPOINT ["/app/run.sh"]

FROM postgres:16-alpine

RUN apk add --no-cache bash jq

WORKDIR /app

COPY run.sh /app/run.sh
RUN sed -i 's/\r$//' /app/run.sh && chmod +x /app/run.sh

USER postgres

ENTRYPOINT ["/app/run.sh"]

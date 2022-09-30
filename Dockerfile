FROM nginx
COPY dist/Desert21/ www
RUN ls -la
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 9090

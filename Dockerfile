FROM nginx
COPY dist/Desert21/ www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 4201

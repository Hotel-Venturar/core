FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD=user
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=Us.123
ENV MYSQL_DATABASE=hotelventura
ADD ./scripts/* /docker-entrypoint-initdb.d/
EXPOSE 3306:3306

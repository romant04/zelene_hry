FROM maven:3.9-eclipse-temurin-17 as build

WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY .env .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/.env .
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
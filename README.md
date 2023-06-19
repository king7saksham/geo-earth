# Geo Earth

Geo Earth is a web application that provides interactive visualization of geographic data on a global map. It allows users to explore various country-related information such as population, area, capital, currency, and more. The application is built using React, Mapbox GL JS, Spring Boot, PostgreSQL, and PostGIS.

## Technologies Used

- React
- Mapbox GL JS
- Spring Boot
- PostgreSQL
- PostGIS

## Features

- Interactive map: The application displays a world map powered by Mapbox GL JS, allowing users to zoom in, pan, and explore different regions.

- Country data: Each country is represented as a polygon on the map, and users can click on a country to select or deselect it. Selected countries are highlighted, and their population and area are tracked.

- Search functionality: Users can search for specific countries using the built-in search feature powered by Mapbox Geocoding API.

- Total counters: The application shows total population and total area counters, which update dynamically as countries are selected or deselected.

## Getting Started

Follow these instructions to set up and run the geo-earth application on your local machine.

### Prerequisites

Make sure you have the following software installed on your machine:

- Node.js (version 18.16.10 or higher)
- npm (version 8.19.4 or higher)
- Java Development Kit (JDK) (version 11 or higher)

You can download Node.js and npm from the official Node.js website: https://nodejs.org

The Java Development Kit (JDK) can be downloaded from the Oracle website or through a package manager like Homebrew (for macOS users) or apt-get (for Linux users).

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/king7saksham/geo-earth.git
```

2. Navigate to the project directory:

```bash
    cd geo-earth
```

3. Set up the frontend:

- Open a terminal and navigate to the worldmap directory.

- Install the dependencies:

```bash
npm install
```

4. Start the backend server:

- Open a terminal and navigate to the country directory.

- Build the project:

```bash
mvn clean package
```

- Run the server:

```bash
java -jar target/country-0.0.1-SNAPSHOT.jar
```

### Usage

1. Start the frontend development server:

```bash
npm start
```
2. Open your web browser and visit http://localhost:3000 to access the Geo Earth application.

## License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

## Acknowledgements
- [React](https://react.dev/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org/)
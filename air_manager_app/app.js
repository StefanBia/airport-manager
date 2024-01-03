const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;
const last = "flights";
const lastQuery = 'SELECT * FROM flight';
const lastId = 'flightid'
const lastName = 'flight_destination'
const lastDate = 'departure_date'

// Set up a PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'airport_manager',
    password: 'dardulau',
    port: 5432,
});

// Helper function to fetch data with optional ordering
async function fetchDataWithOrder(req, res, query, orderBy) {
    try {
        const result = await pool.query(`${query} ORDER BY ${orderBy}`);
        res.setHeader('Content-Type', 'application/json');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function fetchDataByName(req, res, query, orderBy) {
    const searchTerm = req.params.term;
    // const query = 'SELECT * FROM flight WHERE flight_destination LIKE $1';

    try {
        const result = await pool.query(`${query} ORDER BY ${orderBy}`, [`%${searchTerm}%`]);
        res.setHeader('Content-Type', 'application/json');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/${last}/id', async (req, res) => {
    fetchDataWithOrder(req, res, { lastQuery }, { lastId });
});

// Define routes for fetching data

app.get('/flights', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight', 'flightid');
});

app.get('/flights/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight', 'flightid');
});

app.get('/flights/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight', 'flight_destination');
});

app.get('/flights/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight', 'departure_date');
});

app.get('/flights/srcn/:term', async (req, res) => {
    fetchDataByName(req, res,'SELECT * FROM flight WHERE flight_destination LIKE $1', 'flightid');
});


// ----------------------------------------------------------

app.get('/pilots', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p2.first_name , p2.last_name, fc.company_name , p.salary , p.date_of_employment from pilot p join person p2 ON p.pilotid = p2.personid join flight_company fc on p.flight_companyid = fc.flight_companyid', 'p.pilotid');
});

app.get('/pilots/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p2.first_name , p2.last_name, fc.company_name , p.salary , p.date_of_employment from pilot p join person p2 ON p.pilotid = p2.personid join flight_company fc on p.flight_companyid = fc.flight_companyid', 'p.pilotid');
});

app.get('/pilots/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p2.first_name , p2.last_name, fc.company_name , p.salary , p.date_of_employment from pilot p join person p2 ON p.pilotid = p2.personid join flight_company fc on p.flight_companyid = fc.flight_companyid', 'p2.last_name');
});

app.get('/pilots/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p2.first_name , p2.last_name, fc.company_name , p.salary , p.date_of_employment from pilot p join person p2 ON p.pilotid = p2.personid join flight_company fc on p.flight_companyid = fc.flight_companyid', 'p.date_of_employment');
});

app.get('/pilots/srcn/:term', async (req, res) => {
    fetchDataByName(req, res,'select p2.first_name , p2.last_name, fc.company_name , p.salary , p.date_of_employment from pilot p join person p2 ON p.pilotid = p2.personid join flight_company fc on p.flight_companyid = fc.flight_companyid where p2.first_name like $1', 'p.pilotid');
});

// ----------------------------------------------------------

app.get('/airports', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM airport', 'airportid');
});

app.get('/airports/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM airport', 'airportid');
});

app.get('/airports/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM airport', 'airport_name');
});

app.get('/airports/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM airport', 'airportid');
});

app.get('/airports/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'SELECT * FROM airport where airport_name like $1', 'airportid');
});
// ----------------------------------------------------------

app.get('/persons', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM person', 'personid');
});

app.get('/persons/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM person', 'personid');
});

app.get('/persons/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM person', 'last_name');
});

app.get('/persons/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM person', 'birthday');
});

app.get('/persons/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'SELECT * FROM person where last_name like $1', 'personid');
});

// ----------------------------------------------------------

app.get('/flight_companies', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight_company', 'flight_companyid');
});

app.get('/flight_companies/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight_company', 'flight_companyid');
});

app.get('/flight_companies/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight_company', 'company_name');
});

app.get('/flight_companies/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT * FROM flight_company', 'flight_companyid');
});

app.get('/flight_companies/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'SELECT * FROM flight_company where company_name like $1', 'flight_companyid');
});

// ----------------------------------------------------------

app.get('/airplanes', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT a.airplane_model , a.airplane_nr_seats, fc.company_name FROM airplane a join flight_company fc on a.flight_companyid = fc.flight_companyid', 'a.airplaneid');
});

app.get('/airplanes/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT a.airplane_model , a.airplane_nr_seats, fc.company_name FROM airplane a join flight_company fc on a.flight_companyid = fc.flight_companyid', 'a.airplaneid');
});

app.get('/airplanes/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT a.airplane_model , a.airplane_nr_seats, fc.company_name FROM airplane a join flight_company fc on a.flight_companyid = fc.flight_companyid', 'a.airplane_model');
});

app.get('/airplanes/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'SELECT a.airplane_model , a.airplane_nr_seats, fc.company_name FROM airplane a join flight_company fc on a.flight_companyid = fc.flight_companyid', 'a.airplaneid');
});

app.get('/airplanes/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'SELECT a.airplane_model , a.airplane_nr_seats, fc.company_name FROM airplane a join flight_company fc on a.flight_companyid = fc.flight_companyid where a.airplane_model like $1', 'a.airplaneid');
});

//---------------------------------------------------

app.get('/flight_attendants', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , fa."role" , fc.company_name from flight_attendant fa join person p on fa.flight_attendantid = p.personid join flight_company fc on fc.flight_companyid = fa.flight_companyid', 'fa.flight_attendantid');
});

app.get('/flight_attendants/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , fa."role" , fc.company_name from flight_attendant fa join person p on fa.flight_attendantid = p.personid join flight_company fc on fc.flight_companyid = fa.flight_companyid', 'fa.flight_attendantid');
});

app.get('/flight_attendants/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , fa."role" , fc.company_name from flight_attendant fa join person p on fa.flight_attendantid = p.personid join flight_company fc on fc.flight_companyid = fa.flight_companyid', 'p.last_name');
});

app.get('/flight_attendants/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , fa."role" , fc.company_name from flight_attendant fa join person p on fa.flight_attendantid = p.personid join flight_company fc on fc.flight_companyid = fa.flight_companyid', 'fa.flight_attendantid');
});

app.get('/flight_attendants/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'select p.first_name , p.last_name , fa."role" , fc.company_name from flight_attendant fa join person p on fa.flight_attendantid = p.personid join flight_company fc on fc.flight_companyid = fa.flight_companyid where p.last_name like $1', 'fa.flight_attendantid');
});

//----------------------------------------------------

app.get('/air_traffic_controllers', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , atc.weekly_hours , ct.tower_number , a.airport_name from air_traffic_controller atc join person p on p.personid = atc.air_traffic_controllerid join control_tower ct on ct.control_towerid = atc.control_towerid join airport a on a.airportid = ct.airportid', 'atc.air_traffic_controllerid');
});

app.get('/air_traffic_controllers/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , atc.weekly_hours , ct.tower_number , a.airport_name from air_traffic_controller atc join person p on p.personid = atc.air_traffic_controllerid join control_tower ct on ct.control_towerid = atc.control_towerid join airport a on a.airportid = ct.airportid', 'atc.air_traffic_controllerid');
});

app.get('/air_traffic_controllers/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , atc.weekly_hours , ct.tower_number , a.airport_name from air_traffic_controller atc join person p on p.personid = atc.air_traffic_controllerid join control_tower ct on ct.control_towerid = atc.control_towerid join airport a on a.airportid = ct.airportid', 'p.last_name');
});

app.get('/air_traffic_controllers/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'select p.first_name , p.last_name , atc.weekly_hours , ct.tower_number , a.airport_name from air_traffic_controller atc join person p on p.personid = atc.air_traffic_controllerid join control_tower ct on ct.control_towerid = atc.control_towerid join airport a on a.airportid = ct.airportid', 'atc.air_traffic_controllerid');
});

app.get('/air_traffic_controllers/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'select p.first_name , p.last_name , atc.weekly_hours , ct.tower_number , a.airport_name from air_traffic_controller atc join person p on p.personid = atc.air_traffic_controllerid join control_tower ct on ct.control_towerid = atc.control_towerid join airport a on a.airportid = ct.airportid where p.last_name like $1', 'atc.air_traffic_controllerid');
});

//------------------------------------

app.get('/control_towers', async (req, res) => {
    fetchDataWithOrder(req, res, 'select ct.tower_number , a.airport_name from control_tower ct join airport a on ct.airportid = a.airportid', 'ct.control_towerid');
});

app.get('/control_towers/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'select ct.tower_number , a.airport_name from control_tower ct join airport a on ct.airportid = a.airportid', 'ct.control_towerid');
});

app.get('/control_towers/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'select ct.tower_number , a.airport_name from control_tower ct join airport a on ct.airportid = a.airportid', 'a.airport_name');
});

app.get('/control_towers/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'select ct.tower_number , a.airport_name from control_tower ct join airport a on ct.airportid = a.airportid', 'ct.control_towerid');
});

app.get('/control_towers/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'select ct.tower_number , a.airport_name from control_tower ct join airport a on ct.airportid = a.airportid where a.airport_name like $1', 'ct.control_towerid');
});

//-------------------------------------

app.get('/runways', async (req, res) => {
    fetchDataWithOrder(req, res, 'select r.runway_number , a.airport_name from runway r join airport a on a.airportid = r.airportid', 'r.runwayid');
});

app.get('/runways/id', async (req, res) => {
    fetchDataWithOrder(req, res, 'select r.runway_number , a.airport_name from runway r join airport a on a.airportid = r.airportid', 'r.runwayid');
});

app.get('/runways/name', async (req, res) => {
    fetchDataWithOrder(req, res, 'select r.runway_number , a.airport_name from runway r join airport a on a.airportid = r.airportid', 'a.airport_name');
});

app.get('/runways/date', async (req, res) => {
    fetchDataWithOrder(req, res, 'select r.runway_number , a.airport_name from runway r join airport a on a.airportid = r.airportid', 'r.runwayid');
});

app.get('/runways/srcn/:term', async (req, res) => {
    fetchDataByName(req, res, 'select r.runway_number , a.airport_name from runway r join airport a on a.airportid = r.airportid where a.airport_name like $1', 'r.runwayid');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

# Drone Delivery Service - Dispatch Controller

A RESTful API service for managing a fleet of drones for medication delivery.

#### **Features**

1. Register and manage drones
2. Load drones with medications
3. Check available drones for loading
4. Monitor drone battery levels
5. Automatic battery level auditing
6. Prevent overloading and low battery operations
7. Drone battery charging and discharging simulation
8. Full drone journey simulation
9. Full Docker support with Docker Compose

## Tech Stack

* **Runtime**: Node.js with TypeScript
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: TypeORM
* **Queue**: BullMQ with Redis
* **Containerization**: Docker & Docker Compose

## Prerequisites

* Docker & Docker Compose
* Node.js 18+ (for local development)
* **npm or yarn**

#### Quick Start with Docker

1. Clone the repository
   ```bash
   git clone `<repository-url>`
   cd Drone-Management-Service---BlueSalt
   ```
2. Create environment file
   ``cp .env.example .env ``
3. Build and start services
   ``npm run docker-dev``
4. The API will be available at `http://localhost:3000`


## Local Development Setup

1. **Install dependencies**
   ``npm install ``
2. **Start PostgreSQL and Redis** `docker-compose up postgres redis `
3. ****Run in development mode**** ``npm run dev``
4. ****Run tests**** ``npm test``


#### **API Endpoints**

### **Drones**

#### Register a Drone

```
POST /api/drones
Content-Type: application/json 
{ 
   "serialNumber": "DRONE-XYZ-123",
   "model": "Lightweight",
   "weightLimit": 125,
   "batteryCapacity": 100
}
```

#### Load drone

```
POST /api/drones/load
Content-Type: application/json
{
    "droneId": "73d0fe54-185b-4f27-b2c9-50fc104e03c5",
    "medicationIds": ["2d5c9f2f-6311-4e87-89bd-53195bd25cc7", "beede402-7ce5-45d9-b7dd-69e78c3ebcba"]
}
```

#### Get all drones

``GET /api/drones?pageSize=10&page=2&sortBy=desc&model=Middleweight&state=IDLE&dateFrom=&dateTo=``

#### Get available drones for Loading

``GET /api/drones/available``

#### Get drone's loaded medications

``GET api/drones/:droneId/medications?page=&pageSize=&model=&sortBy=``

#### Get drone's battery level

``GET /api/drones/:droneId/battery``

### **Medications**

#### Get all medications

``GET api/medications?page=&pageSize=20&sortBy=``

#### Register medication

```
POST api/medications
Content-Type: application/json

{
    "code": "PRC_09",
    "name": "Paracetamol02",
    "weight": 100,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-5gO444STUsKz8kzSYWrB-KEPCTYOJAHbEA&s"
}
```

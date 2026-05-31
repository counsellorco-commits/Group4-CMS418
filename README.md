    TrackIt

    Group 4 – CMS 418

TrackIt is a Wireless Emergency Telemedicine System developed as part of the CMS 418 course project. The application provides a patient management interface alongside a real-time ECG monitoring module designed to handle the acquisition and visualisation of electrocardiogram (ECG) data.

The project currently focuses on frontend interface development, patient management workflows, and ECG signal visualisation using streamed sample data.


    Screens

 1. Landing Page

File: `index.html`

The landing page introduces the TrackIt system and serves as the entry point into the application.

Features:

* Project branding
* System overview
* Navigation to authentication pages


 2. Login Screen

File: `login.html`

Provides user authentication functionality.

Features:

* User login interface
* Form validation
* Access control entry point


 3. New Patient Screen

File: `new-patient.html`

Allows healthcare personnel to register a new patient.

Features:

* Patient demographic information capture
* Input validation
* Structured patient data entry



 4. Find Patient Screen

File: `find-patient.html`

Used to locate and retrieve patient information.

Features:

* Patient lookup interface
* Search functionality
* Patient selection workflow



 5. ECG Monitor Screen

File: `ECG monitor.html`

Displays ECG waveforms in real time.

Features:

* Real-time ECG rendering
* Streaming data visualisation
* Dedicated vitals display section
* Prototype implementation using sample ECG recordings



    Project Structure

ECGApp/
│
├── css/
│   └── styles.css
│
├── JS/
│   ├── stream.js
│   ├── findPatientValidator.js
│   ├── newPatientValidator.js
│   └── login.js
│
├── Design/
│   ├── Home.png
│   ├── logIn.png
│   ├── Find-patient.png
│   ├── New-patient.png
│   ├── ECG-Monitor.png
│   └── figmalink.txt
│
├── WEB-INF/
│   ├── web.xml
│   └── classes/
│       └── com/
│           └── myapp/
│               ├── servlets/
│               │   └── StreamServlet.java
│               └── utils/
│                   └── FileUtil.java
│
├── index.html
├── login.html
├── new-patient.html
├── find-patient.html
└── ecg-monitor.html



    ECG Module

The ECG monitor currently uses prerecorded ECG sample data stored in a text file.

The server:

1. Reads ECG samples from the data file.
2. Converts the samples into a time-series format.
3. Streams data to the frontend using Server-Sent Events (SSE).
4. Sends ECG data in batches to simulate live acquisition.

The frontend:

1. Receives streamed ECG data.
2. Stores samples in a rendering buffer.
3. Draws the waveform continuously on an HTML Canvas.

The architecture is designed to allow future replacement of the sample data source with live sensor data.



    Design System

The TrackIt interface follows a clean healthcare-oriented design language.

 Styling

Central styling is maintained within:

css/styles.css


The stylesheet provides:

* Colour variables
* Layout utilities
* Form styling
* Component styling
* Responsive behaviour

 Design Assets

The `Design/` directory contains reference screens and design resources used during development.



    Technologies Used

Frontend:

* HTML5
* CSS3
* JavaScript

Backend:

* Java Servlets
* Server-Sent Events (SSE)

Server:

* Apache Tomcat 9

Version Control:

* Git
* GitHub



    How to Run

 Prerequisites

* Java JDK 8 or later
* Apache Tomcat 9
* Git (optional)



 Setup

1. Clone the repository.


git clone https://github.com/counsellorco-commits/Group4-CMS418


2. Copy the project into the Tomcat `webapps` directory.

3. Start Tomcat.

4. Open a browser and navigate to:


http://localhost:8080/ECGApp/



 Accessing Pages

Landing Page:


http://localhost:8080/ECGApp/index.html


Login:


http://localhost:8080/ECGApp/login.html


Find Patient:


http://localhost:8080/ECGApp/find-patient.html


New Patient:


http://localhost:8080/ECGApp/new-patient.html


ECG Monitor:


http://localhost:8080/ECGApp/ecg-monitor.html

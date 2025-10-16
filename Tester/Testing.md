#  NT Local Event Finder  
**Group B – PRT681 Software Testing Project**


##  Team Members

| Role | Name | Student ID | GitHub Folder |
|------|------|-------------|----------------|
|  **Tester** | **Musrat Jahan** | S380098 | [Tester Folder](https://github.com/ddrandy/S225_PRT681_GROUP_B/tree/master/Tester) |
|  **Junior Developer** | **Meetkumar Dharmeshbhai Savaliya** | S382825 |  |
|  **Senior Developer** | **Mingzhen Dong** | S371932 | |
|  **Business Analyst** | **Yibo Xu** | S376864 | [BA Folder](https://github.com/ddrandy/S225_PRT681_GROUP_B/tree/master/BA) |


##  GitHub Repository

- **Repository Name:** `S225_PRT681_GROUP_B`  
- **Repository URL:** [https://github.com/ddrandy/S225_PRT681_GROUP_B](https://github.com/ddrandy/S225_PRT681_GROUP_B)


##  Group Collaboration

- **Platform:** Microsoft Teams  
- **Channel:** Group B  
- **Channel URL:** [Group B Teams Channel](https://teams.microsoft.com/l/channel/19%3A6ae59b18dfac4f568077c44145e060a8%40thread.tacv2/Group-B?groupId=4ccfbc39-217a-4425-80bd-cb87296d1d50&tenantId=9f248767-8e1a-42f3-836f-c092ab95ff70)


##  Project Overview

**NT Local Event Finder** is a web application that helps people in the Northern Territory discover, explore, and register for local events.  

###  Key Features
- Browse and search for upcoming events  
- View event **details** (date, time, venue, suburb, description, Google Maps link)  
- Register interest in events  
- Save favourite events for later  

🔗 **Live URL:** [https://ntevent.randytech.top/events](https://ntevent.randytech.top/events)

![NT Events](https://github.com/ddrandy/S225_PRT681_GROUP_B/blob/master/Tester/NTEventwebpage.png)

##  Testing Overview

- Navigate the webpage and website.
- Validate search, filter, and registration functions  
- Verify API response accuracy and data flow  
- Check UI consistency and browser compatibility  
- Assess system performance under load  
- Detect security vulnerabilities  



##  Test Cases 

| Test ID | Feature | Description | Expected Result | Actual Result | Status|
|----------|----------|--------------|----------------|-------------|-------|
| TC01 | Navigate | Navigate the page | Display Homepage | Display Homepage|  Passed |
| TC02 | Login |  Login as a user| Login The page valid User | Login the page |  Passed |
| TC03 | Login |  Login as a user invalid name & Password|  Can't Login The page | Error Message |  Passed |
| TC04 | Event Search | Search by keyword| Events display correctly |   Display Event list page | Passed |
| TC05 | Event Details | View event info | Accurate details shown | Button is not working| Failed |
| TC06 | User Registration | Register new user | Success message shown | Button is not working| Failed |
| TC07 | Favourites | Save event | Appears in profile | Page is not working | Failed |
| TC08 | Map Link | Open Google Map | Correct location opens | Link is not working | Failed |

---

##  API Testing — *Postman*

**Tool:** [Postman](https://www.postman.com/)  
**Goal:** Validate backend endpoints and data integrity.  

| Endpoint | Method | Purpose | Status |
|-----------|---------|---------|--------|
| `/events` | GET | Fetch all events | ✅ 200 OK |
| `/events/:id` | GET | Fetch single event | ✅ 200 OK |
| `/users/register` | POST | Register user | ✅ 201 Created |
| `/favourites` | POST | Add to favourites | ✅ 200 OK |

 Postman:  [`/Tester/API Testing`](https://github.com/ddrandy/S225_PRT681_GROUP_B/blob/master/Tester/API%20Testing/Postman)

### Screenshots
![Postman Request Run](https://github.com/ddrandy/S225_PRT681_GROUP_B/blob/master/Tester/API%20Testing/Postman%20NT%20EVent.png)  


---

##  UI Automation Testing — *Selenium (Python)*

**Tool:** [Selenium WebDriver](https://www.selenium.dev/)  
**Goal:** Automate UI tests for navigation, buttons, and forms.  

### Test
- Navigate the Website

**Environment:** Chrome + Python (WebDriver Manager)

 Selenium: https://github.com/ddrandy/S225_PRT681_GROUP_B/tree/master/Tester/Selenium

###  Screenshots
![Selenium  homepage Nagivate Test](https://github.com/ddrandy/S225_PRT681_GROUP_B/blob/master/Tester/Selenium/Selenium%20NT%20Event%20.png)  

---

##  Performance Testing — *Apache JMeter*

**Tool:** [Apache JMeter](https://jmeter.apache.org/)  
**Goal:** Evaluate performance, load capacity, and response time.  

### Scenarios
- 50 concurrent users searching events  
- Load test for API endpoints  
- Throughput and response rate monitoring  

**Metrics:** Http requests| Response Time |  

  JMeter: https://github.com/ddrandy/S225_PRT681_GROUP_B/tree/master/Tester/Performance%20Testing

###  Screenshots
 ![JMeter Dashboard](https://github.com/ddrandy/S225_PRT681_GROUP_B/blob/master/Tester/Performance%20Testing/JmeterNTEVent.png)

----

##  Security Testing — *OWASP ZAP*

**Tool:** [OWASP ZAP](https://www.zaproxy.org/)  
**Goal:** Identify and resolve security vulnerabilities.  

### Scans
- Active Scan (SQL Injection, Broken Auth)  
- Passive Scan (Headers, Cookies)  
- XSS and Input Validation Tests  

 ZAP: https://github.com/ddrandy/S225_PRT681_GROUP_B/tree/master/Tester/Security%20Testing

### Screenshots
Website is working  so no alerts:

![ZAP Dashboard](https://github.com/ddrandy/S225_PRT681_GROUP_B/blob/master/Tester/Security%20Testing/ZAP/NTEventPlanner_ZAP_SS.png)

 --- 
 
  For Youtube 
  
  ![ZAP Alert Report](https://github.com/ddrandy/S225_PRT681_GROUP_B/blob/master/Tester/Security%20Testing/ZAP/ZAP_Practice4.png)





# Project Estimation  

Authors: 
* Alessio Carachino
* Samuele Giangreco
* Daniel Guarecuco
* Zoltan Mazzuco

Date: 22 march 2022

Deadline: 13 april 2022

version: 1

# Estimation approach
Consider the EZWH  project as described in YOUR requirement document, assume that you are going to develop the project INDEPENDENT of the deadlines of the course

# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed                 | 20                         |             
|  A = Estimated average size per class, in LOC                     | 200                           | 
| S = Estimated size of project, in LOC (= NC * A)                  | 4000                               |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  | 400                                     |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro)                   | 12000          | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) | 2.5                  |               

# Estimate by product decomposition
### 
|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|Requirement document   | 30 |
|GUI prototype          | 10 |
|Design document        | 30 |
|Code                   | 400|
|Unit tests             | 20 |
|API tests              | 10 |
|Management documents   | 20 |



# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|Requirements            | 70 |
|+Requirement document   | 30 |
|+GUI prototype          | 10 |
|+Design document        | 30 |
|Coding                  | 400|
|+Order interface        | 150|
|+Inventory interface    | 150|
|+Login interface        | 100|
|Testing                 | 30 |
|+Unit tests             | 20 |
|+API tests              | 10 |
|Management documents    | 20 |

###

![Gant](diagrams/EzWh_Gantt.png)

# Summary

Report here the results of the three estimation approaches. The  estimates may differ. Discuss here the possible reasons for the difference

|             | Estimated effort                        |   Estimated duration |          
| ----------- | ------------------------------- | ---------------|
| estimate by size                   |400|  2.5 Weeks |
| estimate by product decomposition  |520|  3.25 Weeks |
| estimate by activity decomposition |520|  15 Week |

In the first case, only the lines of codes (LOC) are taken into account for the calculation of the estimated effort. This approach also considers that 
all 400 LOC can be written concurrently by all 4 team members during the entire duration of the project. None of the tasks need to wait for others, this is unrealistic.

The second case (product decomposition) also takes into account the time required to write all documents and possible tests on the code, that is why the estimed effort and duration is greater than the previous case. The same assumption about concurrency is applied, therefore, all tasks can be executed in parallel by 100% effort of all team members.

The third estimation, based on a Gantt diagram is more realistic. It takes the same amout of person-hours as the second case, because all milestones are the same. However, each task has one or several dependencies on previous task. It means that a given task can only be started after all previous tasks are completed. Also, team members are assigned different tasks based on their expertise and availability, so there are cases where only 1 team members is working, while the others are idle waiting for dependencies to be completed.




